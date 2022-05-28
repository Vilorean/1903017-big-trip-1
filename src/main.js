import { render, RenderPosition } from './render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoView from './view/trip-info-view.js';
import TripTabsView from './view/trip-tabs-view.js';
import {generatePoint} from './mock/point.js';
import TripPresenter from './presenter/trip-presenter';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const POINT_COUNT = 14;

const points = Array.from({length: POINT_COUNT}, generatePoint);
const pageMainElement = document.querySelector('.page-body');

const siteTripMainElement = document.querySelector('.trip-main');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
pointsModel.points = points;

const filterModel = new FilterModel();

render(siteTripMainElement, new TripInfoView().element, RenderPosition.AFTERBEGIN);
render(tripControlsNavigationElement, new TripTabsView(), RenderPosition.BEFOREEND);

const tripPresenter = new TripPresenter(pageMainElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel);

filterPresenter.init();
tripPresenter.init();
