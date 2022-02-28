import {createEventEditTemplate} from './view/event-edit-view.js';
import {createTripFiltersTemplate} from './view/trip-filters-view';
import {createTripInfoTemplate} from './view/trip-info-view.js';
import {createTripSortTemplate} from './view/trip-sort-view.js';
import {createTripTabsTemplate} from './view/trip-tabs-view.js';
import {createEventsListTemplate} from "./view/events-list-view.js";
import {createWaypointTemplate} from './view/waypoint-view.js';
import {renderTemplate, RenderPosition} from './render.js';

const WAYPOINT_COUNT = 3; //число точек для отрисовки нашего маршрута 

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);
const siteTripControlsFirstHeadingElement = siteTripControlsElement.querySelector(`h2:first-of-type`);
const siteTripControlsLastHeadingElement = siteTripControlsElement.querySelector(`h2:last-of-type`);

renderTemplate(siteTripMainElement, createTripInfoTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(siteTripControlsFirstHeadingElement, createTripTabsTemplate(), RenderPosition.AFTEREND);
renderTemplate(siteTripControlsLastHeadingElement, createTripFiltersTemplate(), RenderPosition.AFTEREND);

const siteTripEventsElement = document.querySelector(`.trip-events`);

renderTemplate(siteTripEventsElement, createTripSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteTripEventsElement, createEventsListTemplate(), RenderPosition.BEFOREEND);

const eventsList = siteTripEventsElement.querySelector(`.trip-events__list`);

renderTemplate(eventsList, createEventEditTemplate(), RenderPosition.BEFOREEND);
for (let i = 0; i < WAYPOINT_COUNT; i++) {
    renderTemplate(eventsList, createWaypointTemplate(), RenderPosition.BEFOREEND);
}