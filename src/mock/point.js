import dayjs from 'dayjs';
import { offers } from '../utils/offers';
import { destinations } from '../utils/destinations';
//import { descriptions } from '../utils/descriptions';
//import { generateImages } from '../utils/functions';
import { nanoid } from 'nanoid';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generatePrice = () => getRandomInteger(1, 100) * 10;

/*const generateDestination = () => {
  const dest = destinations();
  const randomIndex = getRandomInteger(0, dest.length - 1);
  return dest[randomIndex];
};*/

const generateFromToDates = () => {
  const maxGap = 14;
  const fromDate = dayjs()
    .add(getRandomInteger(-maxGap, maxGap), 'day')
    .add(getRandomInteger(-maxGap, maxGap), 'hour')
    .add(getRandomInteger(-maxGap, maxGap), 'minute');
  const toDate = fromDate
    .clone()
    .add(getRandomInteger(0, 14), 'day')
    .add(getRandomInteger(0, 59), 'hour')
    .add(getRandomInteger(0, 59), 'minute');

  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString()
  };
};

/*const countDuration = (start, end) => {
  const period = new Date(end - start);
  return {
    days: period.getDate() - 1,
    hours: period.getHours(),
    minutes: period.getMinutes(),
  };

};*/

/*export const generateDescription = () => {
  const description = descriptions();
  const randomIndex = getRandomInteger(0, description.length - 1);
  return description[randomIndex];
};*/

/*const generateOffers = () => {
  const offers = [
    {
      name: 'Infotainment system',
      price: 50,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'flight'
    },
    {
      name: 'Wake up at a certain time',
      price: 140,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'train'
    },
    {
      name: 'Book a taxi at the arrival point',
      price: 110,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'flight'
    },
    {
      name: 'Add luggage',
      price: 30,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'luggage'
    },
    {
      name: 'Switch to comfort class',
      price: 100,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'flight'
    },
    {
      name: 'Add meal',
      price: 15,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'meal'
    },
    {
      name: 'Choose seats',
      price: 5,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'flight'
    },
    {
      name: 'With air conditioning',
      price: 40,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'car'
    },
    {
      name: 'Choose live music',
      price: 200,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'restaurant'
    },
    {
      name: 'Add breakfast',
      price: 40,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'meal'
    },
    {
      name: 'Lunch in city',
      price: 55,
      isChosen: Boolean(getRandomInteger(0,1)),
      type: 'meal'
    },
  ];

  let count = getRandomInteger(0, 5);
  let len = offers.length;
  const result = new Array(count);
  const taken = new Array(len);

  if (count > len)
  {
    throw new RangeError('getRandom: more elements taken than available');
  }
  while (count--) {
    const x = Math.floor(Math.random() * len);
    result[count] = offers[x in taken ? taken[x] : x];
    taken[x] = --len;
  }
  return result;
};
*/
export const generatePoint = () => {
  const dates = generateFromToDates();
  const destinationArray = destinations();
  const offerArray = offers();

  /*return {
    id: nanoid(),
    //waypointType: generateType(),
    destination: generateDestination(),
    startDate: dates.start,
    endDate: dates.end,
    duration: countDuration(dates.start, dates.end),
    description: generateDescription(),
    images: generateImages(),
    price: generatePrice(),
    //offers: generateOffers(),
    isFavorite: Boolean(getRandomInteger(0,1)),
    'offers': offersList(),
    isBeingEdited: false
  };*/

  return {
    basePrice: generatePrice(),
    dateFrom: dates.from,
    dateTo: dates.to,
    //'destination': generateDestination(),
    //images: generateImages(),
    //description: generateDescription(),
    destination: destinationArray[getRandomInteger(0,destinationArray.length-1)],
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0,1)),
    offers: offerArray,
    type: offerArray[getRandomInteger(0,offerArray.length-1)].type
  };
};
