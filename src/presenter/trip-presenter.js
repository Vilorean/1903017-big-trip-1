import TripSortView from '../view/trip-sort-view.js';
import EventsListView from '../view/events-list-view.js';
import LoadingView from '../view/loading-view.js';
import NoTripWaypointsView from '../view/no-trip-waypoints-view.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import {render, RenderPosition, remove} from '../render.js';
import {sortTaskByDay, sortTaskByDuration, sortTaskByPrice} from '../utils/sort-point.js';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType, State} from '../consts.js';

export default class TripPresenter {
  #apiService = null;

  #mainContainer = null;
  #tableContainer = null;

  #pointsModel = null;
  #filterModel = null;

  #eventsListComponent = new EventsListView();
  #loadingComponent = new LoadingView();
  #noTripWaypointsComponent = null;
  #sortComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #currentSortType = SortType.SORT_DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  #destinations = null;
  #offers = null;

  constructor(mainContainer, pointsModel, filterModel, apiService) {
    this.#mainContainer = mainContainer;
    this.#tableContainer = this.#mainContainer.querySelector('.trip-events');
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#apiService = apiService;
    this.#pointNewPresenter = new PointNewPresenter(this.#eventsListComponent, this.#handleViewAction);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.SORT_DAY:
        return filteredPoints.sort(sortTaskByDay);
      case SortType.SORT_TIME:
        return filteredPoints.sort(sortTaskByDuration);
      case SortType.SORT_PRICE:
        return filteredPoints.sort(sortTaskByPrice);
    }
    return filteredPoints;
  }

  init = async () => {
    try {
      this.#destinations = await this.#apiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    try {
      this.#offers = await this.#apiService.offers;
    } catch(err) {
      this.#offers = [];
    }

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderTable();
  };

  destroy = () => {
    this.#clearTable( true);

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setViewState(State.SAVING);
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(State.ABORTING);
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setViewState(State.DELETING);
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(State.ABORTING);
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTable();
        this.#renderTable();
        break;
      case UpdateType.MAJOR:
        this.#clearTable( true);
        this.#renderTable();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTable();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTable();
    this.#renderTable();
  };

  createPoint = (callback) => {
    this.#clearTable();
    this.#renderTable();

    this.#pointNewPresenter.init(callback, this.#destinations, this.#offers);
  };

  #renderSort = () => {
    this.#sortComponent = new TripSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tableContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(
      this.#eventsListComponent,
      this.#handleViewAction,
      this.#handleModeChange,
      this.#destinations,
      this.#offers
    );
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderLoading = () => {
    render(this.#tableContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    this.#noTripWaypointsComponent = new NoTripWaypointsView(this.#filterType);
    render(this.#eventsListComponent, this.#noTripWaypointsComponent, RenderPosition.AFTERBEGIN);
  };

  #clearTable = (resetSortType = false) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    remove(this.#eventsListComponent);

    if (this.#noTripWaypointsComponent) {
      remove(this.#noTripWaypointsComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.SORT_DAY;
    }
  };

  #renderTable = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    render(this.#tableContainer, this.#eventsListComponent, RenderPosition.BEFOREEND);

    const points = this.points;
    const pointCount = points.length;
    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPoints(points);
  };
}
