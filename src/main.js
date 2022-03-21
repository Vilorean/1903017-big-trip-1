import {renderTemplate, RenderPosition} from './render.js';
import {createEventAddTemplate} from './view/event-add-view';
import {createTripFiltersTemplate} from './view/trip-filters-view.js';
import {createTripInfoTemplate} from './view/trip-info-view.js';
import {createTripSortTemplate} from './view/trip-sort-view.js';
import {createTripTabsTemplate} from './view/trip-tabs-view.js';
//import {createEventEditTemplate} from './view/event-edit-view';
import {createEventsListTemplate} from './view/events-list-view.js';
import {createWaypointTemplate} from './view/waypoint-view.js';
import {generatePoint} from './mock/point';

const POINT_COUNT = 15;
const points = Array.from({length: POINT_COUNT}, generatePoint);

const siteTripMainElement = document.querySelector('.trip-main');
const TripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const TripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const TripEventsElement = document.querySelector('.trip-events');


renderTemplate(siteTripMainElement, createTripInfoTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(TripEventsElement, createEventsListTemplate(), RenderPosition.BEFOREEND);

const TripEventsListElement = TripEventsElement.querySelector('.trip-events__list');

renderTemplate(TripControlsNavigationElement, createTripTabsTemplate(), RenderPosition.BEFOREEND);
renderTemplate(TripControlsFiltersElement, createTripFiltersTemplate(), RenderPosition.BEFOREEND);
renderTemplate(TripEventsElement, createTripSortTemplate(), RenderPosition.AFTERBEGIN);
//renderTemplate(TripEventsListElement, createEventEditTemplate(points[1]), RenderPosition.AFTERBEGIN);
renderTemplate(TripEventsListElement, createEventAddTemplate(points[0]), RenderPosition.AFTERBEGIN);

for (let i = 1; i < POINT_COUNT; i++) {
  renderTemplate(TripEventsListElement, createWaypointTemplate(points[i]), RenderPosition.BEFOREEND);
}
