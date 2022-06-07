import dayjs from 'dayjs';

export const sortRoutesByDay = (waypointA, waypointB) => dayjs(waypointA.dateFrom).diff(dayjs(waypointB.dateFrom));

export const sortRoutesByPrice = (waypointA, waypointB) => {

  if (waypointB.basePrice - waypointA.basePrice !== 0) {
    return waypointB.basePrice - waypointA.basePrice;
  } else {
    return dayjs(waypointA.dateFrom).diff(dayjs(waypointB.dateFrom));
  }
};

export const sortRoutesByDuration = (waypointA, waypointB) => {
  const durationWaypointA = dayjs(waypointA.dateTo).diff(dayjs(waypointA.dateFrom));
  const durationWaypointB = dayjs(waypointB.dateTo).diff(dayjs(waypointB.dateFrom));

  if (durationWaypointB - durationWaypointA !== 0) {
    return durationWaypointB - durationWaypointA;
  } else {
    return dayjs(waypointA.dateFrom).diff(dayjs(waypointB.dateFrom));
  }
};
