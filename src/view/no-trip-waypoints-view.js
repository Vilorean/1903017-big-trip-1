import AbstractView from './abstract-view';
import {FilterType} from '../consts';

const NoWaypointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

const createNoTripWaypointsTemplate = (filterType) => {
  const noWaypointTextValue = NoWaypointsTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${noWaypointTextValue}
    </p>`);
};

export default class NoTripWaypointsView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoTripWaypointsTemplate(this._data);
  }
}
