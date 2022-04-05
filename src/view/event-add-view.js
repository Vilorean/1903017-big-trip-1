import dayjs from 'dayjs';
import { destinations } from '../utils/destinations.js';
import { wayPointTypes } from '../utils/waypointTypes.js';
import { generateImages } from '../utils/functions.js';
import AbstractView from './abstract-view.js';
import { createOffersSegmentMarkup, createWaypointTypesMarkup } from '../utils/forms.js';

const createEventAddTemplate = (point) => {
  const {offers, description} = point;
  const waypointType = 'taxi';
  const templateDatetime = dayjs().add(14, 'day').hour(0).minute(0).format('DD/MM/YY HH:mm');


  const images = generateImages();


  const waypointTypesMarkup = createWaypointTypesMarkup(wayPointTypes(), waypointType);
  const addableOffersMarkup = createOffersSegmentMarkup(offers);
  const imagesList = images.map((x) => (`<img className="event__photo" src="${x}">`)).join('');
  const optionsLocations = destinations().map((x) => (`<option value="${x}"></option>`)).join('');
  const waypointTypeLabel = waypointType.charAt(0).toUpperCase() + waypointType.slice(1);


  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/taxi.png" alt="Event type icon">
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1">
            <datalist id="destination-list-1">
            ${ optionsLocations }
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${templateDatetime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${templateDatetime}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">${addableOffersMarkup}<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            <div class="event__photos-container">
              <div class="event__photos-tape">
              ${imagesList}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`;
};

export default class EventAddView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createEventAddTemplate(this.#point);
  }
}
