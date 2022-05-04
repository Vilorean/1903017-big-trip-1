import dayjs from 'dayjs';
import { destinations } from '../utils/destinations';
import { wayPointTypes } from '../utils/waypointTypes';
import AbstractView from './abstract-view';
import { createOffersSegmentMarkup, createWaypointTypesMarkup } from '../utils/forms.js';

const createEventEditTemplate = (point) => {
  const {waypointType, startDate, endDate, price, offers, description, destination} = point;
  const startDatetime = dayjs(startDate).format('DD/MM/YY HH:mm ');
  const endDatetime = dayjs(endDate).format('DD/MM/YY HH:mm');

  const editedOffersMarkup = createOffersSegmentMarkup(offers);
  //const offersListMarkup = createOfferListMarkup(editedOffersMarkup);
  const optionsLocations = destinations().map((x) => (`<option value="${x}"></option>`)).join('');
  const waypointTypesMarkup = createWaypointTypesMarkup(wayPointTypes(), waypointType);
  const waypointTypeLabel = waypointType.charAt(0).toUpperCase() + waypointType.slice(1);

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${waypointType}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${ waypointTypesMarkup }
                      </fieldset>
                    </div>
                  </div>
                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                    ${ waypointTypeLabel }
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
                    <datalist id="destination-list-1">
                    ${ optionsLocations }
                    </datalist>
                  </div>
                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDatetime}">
                    —
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDatetime}">
                  </div>
                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      €
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>
                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                ${ editedOffersMarkup }
                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                  </section>
                </section>
              </form>
            </li>`;
};

export default class EventEditView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createEventEditTemplate(this.#point);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setRollupClickHandler = (callback) => {
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  }
}
