import {render, RenderPosition} from './render.js';
import EventAddView from './view/event-add-view';
import TripFiltersView from './view/trip-filters-view.js';
//import {createTripInfoTemplate} from './view/trip-info-view.js';
import TripSortView from './view/trip-sort-view.js';
import TripTabsView from './view/trip-tabs-view.js';
//import {createEventEditTemplate} from './view/event-edit-view';
import EventsListView from './view/events-list-view.js';
import WaypointView from './view/waypoint-view.js';
import {generatePoint} from './mock/point.js';

const POINT_COUNT = 15;
const points = Array.from({length: POINT_COUNT}, generatePoint);

//const siteTripMainElement = document.querySelector('.trip-main');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripEventsListElement = new EventsListView;

//renderTemplate(siteTripMainElement, createTripInfoTemplate(), RenderPosition.AFTERBEGIN);


render(tripEventsElement, tripEventsListElement.element, RenderPosition.BEFOREEND);
render(tripControlsNavigationElement, new TripTabsView().element, RenderPosition.BEFOREEND);
render(tripControlsFiltersElement, new TripFiltersView().element, RenderPosition.BEFOREEND);
render(tripEventsElement, new TripSortView().element, RenderPosition.AFTERBEGIN);
//renderTemplate(TripEventsListElement, createEventEditTemplate(points[1]), RenderPosition.AFTERBEGIN);
//render(tripEventsListElement.element, new EventAddView(points[0]).element, RenderPosition.BEFOREEND);

const renderEvent = (eventListElement, event) => {
  const waypointComponent = new WaypointView(event);
  const eventAddComponent = new EventAddView(event);

  const replaceItemToForm = () => {
    eventListElement.replaceChild(eventAddComponent.element, waypointComponent.element);
  };
  const replaceFormToItem = () => {
    eventListElement.replaceChild(waypointComponent.element, eventAddComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  waypointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceItemToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventAddComponent.element.querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToItem();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(eventListElement, waypointComponent.element, RenderPosition.BEFOREEND);
};

for (let i = 1; i < POINT_COUNT; i++) {
  renderEvent(tripEventsListElement.element, points[i]);
}
