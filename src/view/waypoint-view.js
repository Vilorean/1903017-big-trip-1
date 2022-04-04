import dayjs from 'dayjs';
import AbstractView from './abstract-view';

const createWaypointTemplate = (point) => {
  const {waypointType, destination, price, startDate, endDate, duration, offers, isFavorite} = point;
  const startDay = dayjs(startDate).format('MMM D');
  const beginDate = dayjs(startDate).format('YYYY-MM-DD');
  const startTime = dayjs(startDate).format('HH:mm');
  const startDatetime = dayjs(startDate).format('YYYY-MM-DDTHH:mm');
  const endTime = dayjs(endDate).format('HH:mm');
  const endDatetime = dayjs(endDate).format('YYYY-MM-DDTHH:mm');

  const getDuration = (period) => {
    const timeDifference = [];
    if (period.days !== 0) {
      timeDifference[0] = `${String(period.days).padStart(2,'0')}D`;
    }
    if (period.hours !== 0) {
      timeDifference[1] = `${String(period.hours).padStart(2,'0')}H`;
    }
    if (period.minutes !== 0) {
      timeDifference[2] = `${String(period.minutes).padStart(2,'0')}M`;
    }
    return timeDifference.join(' ');
  };

  const createOfferMarkup = (offer) => {
    if (offer.isChosen) {
      const offerName = offer.name;
      const offerPrice = offer.price;
      return `<li class="event__offer">
                    <span class="event__offer-title">${offerName}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offerPrice}</span>
                  </li>`;
    }
  };

  const isFavoriteClass = isFavorite ? ' event__favorite-btn--active' : '';

  const OffersMarkup = offers.map(createOfferMarkup).join('');
  const durationText = getDuration(duration);


  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${beginDate}">${startDay}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${waypointType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${waypointType} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDatetime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDatetime}">${endTime}</time>
          </p>
          <p class="event__duration">${durationText}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">${OffersMarkup}</ul>
                <button class="event__favorite-btn${isFavoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export default class EventItemView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createWaypointTemplate(this.#point);
  }
}
