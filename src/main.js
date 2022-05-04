import { render, RenderPosition } from './render.js';
import TripFiltersView from './view/trip-filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import TripTabsView from './view/trip-tabs-view.js';
import {generatePoint} from './mock/point.js';
import TripPresenter from './presenter/trip-presenter';

const POINT_COUNT = 14;

const points = Array.from({length: POINT_COUNT}, generatePoint);
const pageMainElement = document.querySelector('.page-body');

const siteTripMainElement = document.querySelector('.trip-main');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');

render(siteTripMainElement, new TripInfoView().element, RenderPosition.AFTERBEGIN);
render(tripControlsNavigationElement, new TripTabsView(), RenderPosition.BEFOREEND);
render(tripControlsFiltersElement, new TripFiltersView(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(pageMainElement);
tripPresenter.init(points);
