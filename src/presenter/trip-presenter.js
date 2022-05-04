import { render, RenderPosition } from '../render';
import EventsListView from '../view/events-list-view';
import NoTripPointView from '../view/no-trip-point-view';
import TripSortView from '../view/trip-sort-view';
//import EventAddView from '../view/event-add-view';
import PointPresenter from './point-presenter';

export default class TripPresenter {
    #mainElement = null;
    #tripPointsElement = null;

  #tripSortComponent = new TripSortView();
  #noTripPointComponent = new NoTripPointView();
  #tripEventsListElement = new EventsListView();

  #points = [];

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

  #renderSort = () => {
    render(this.#tripPointsElement, this.#tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderTripEvent = (tripPoint) => {
    const pointPresenter = new PointPresenter(this.#tripEventsListElement);
    pointPresenter.init(tripPoint);
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
}
