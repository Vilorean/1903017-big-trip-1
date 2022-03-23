import dayjs from 'dayjs';
export const createWaypointTemplate = (waypoint) => {
  const {wayPointType, destination, price, startDate, endDate, duration, offers, isFavorite} = waypoint;
  const startDay = dayjs(startDate).format('MMM D');
  const beginDate = dayjs(startDate).format('YYYY-MM-DD');
  const startTime = dayjs(startDate).format('HH:mm');
  const startDatetime = dayjs(startDate).format('YYYY-MM-DDTHH:mm');
  const endTime = dayjs(endDate).format('HH:mm');
  const endDatetime = dayjs(endDate).format('YYYY-MM-DDTHH:mm');

  const getDurationString = (period) => {
    const result = [];
    if (period.days !== 0) {
      result[0] = String(period.days).padStart(2,'0');
      result[0] += 'D';
    }
    if (period.hours !== 0) {
      result[1] = String(period.hours).padStart(2,'0');
      result[1] += 'H';
    }
    if (period.minutes !== 0) {
      result[2] = String(period.minutes).padStart(2,'0');
      result[2] += 'M';
    }
    return result.join(' ');
  };
  const durationString = getDurationString(duration);

  const createListOffers = (offer) => {
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

  const listOffers = offers.map(createListOffers).join('');
  const isFavoriteClass = isFavorite ? ' event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
  <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${beginDate}">${startDay}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${wayPointType}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${wayPointType} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDatetime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDatetime}">${endTime}</time>
          </p>
          <p class="event__duration">${durationString}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">${listOffers}</ul>
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
