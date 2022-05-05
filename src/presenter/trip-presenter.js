import { render, RenderPosition } from '../render';
import EventsListView from '../view/events-list-view';
import NoTripPointView from '../view/no-trip-point-view';
import TripSortView from '../view/trip-sort-view';
//import EventAddView from '../view/event-add-view';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils/common';

export default class TripPresenter {
    #mainElement = null;
    #tripPointsElement = null;

  #tripSortComponent = new TripSortView();
  #noTripPointComponent = new NoTripPointView();
  #tripEventsListElement = new EventsListView();

  #points = [];

 #pointPresenter = new Map();

 constructor(mainElement) {
   this.#mainElement = mainElement;

   this.#tripPointsElement = this.#mainElement.querySelector('.trip-events');
 }

  init = (points) => {
    this.#points = [...points];
    this.#renderMain();
  }

  #renderNoTasks = () => {
    render(this.#tripPointsElement, this.#noTripPointComponent, RenderPosition.BEFOREEND);
  }

  #renderTripEventsListElement = () => {
    render(this.#tripPointsElement, this.#tripEventsListElement, RenderPosition.BEFOREEND);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #renderSort = () => {
    render(this.#tripPointsElement, this.#tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderTripEvent = (tripPoint) => {
    const pointPresenter = new PointPresenter(this.#tripEventsListElement, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(tripPoint);
    this.#pointPresenter.set(tripPoint.id, pointPresenter);
  };

  #renderTripEventsList = () => {
    for (let i = 0; i < this.#points.length; i++) {
      this.#renderTripEvent(this.#points[i]);
    }

  }

  #renderMain = () => {

    if (this.#points.length === 0) {
      this.#renderNoTasks();
    } else {
      this.#renderSort();
      this.#renderTripEventsListElement();
      this.#renderTripEventsList();
    }
  }

  #clearTaskList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

}
