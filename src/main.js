import {render, RenderPosition} from './render.js';
import EventAddView from './view/event-add-view';
import TripFiltersView from './view/trip-filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import TripSortView from './view/trip-sort-view.js';
import TripTabsView from './view/trip-tabs-view.js';
import EventEditView from './view/event-edit-view';
import EventsListView from './view/events-list-view.js';
import WaypointView from './view/waypoint-view.js';
import {generatePoint} from './mock/point.js';
import NoTripPointView from './view/no-trip-point-view';

const POINT_COUNT = 15;

const points = Array.from({length: POINT_COUNT}, generatePoint);

const siteTripMainElement = document.querySelector('.trip-main');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripEventsListElement = new EventsListView();

//render(siteTripMainElement, new TripInfoView().element, RenderPosition.AFTERBEGIN);
render(tripControlsNavigationElement, new TripTabsView(), RenderPosition.BEFOREEND);
render(tripControlsFiltersElement, new TripFiltersView(), RenderPosition.BEFOREEND);

if (points.length === 0) {
  render(tripEventsElement, new NoTripPointView(), RenderPosition.BEFOREEND);
} else {
  render(siteTripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
  render(tripEventsElement, tripEventsListElement, RenderPosition.BEFOREEND);
  render(tripEventsElement, new TripSortView(), RenderPosition.AFTERBEGIN);
  render(tripEventsListElement.element, new EventAddView(points[0]), RenderPosition.BEFOREEND);
}

const renderPoint = (pointListElement, point) => {
  const waypointComponent = new WaypointView(point);
  const eventEditComponent = new EventEditView(point);

  const replaceItemToForm = () => {
    pointListElement.replaceChild(eventEditComponent.element, waypointComponent.element);
  };
  const replaceFormToItem = () => {
    pointListElement.replaceChild(waypointComponent.element, eventEditComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToItem();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  waypointComponent.setEditClickHandler(() => {
    replaceItemToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.setRollupClickHandler(() => {
    replaceFormToItem();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.setFormSubmit(() => {
    replaceFormToItem();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(pointListElement, waypointComponent, RenderPosition.BEFOREEND);
};

for (let i = 1; i < POINT_COUNT; i++) {
  renderPoint(tripEventsListElement.element, points[i]);
}
