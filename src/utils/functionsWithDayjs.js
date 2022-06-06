import dayjs from 'dayjs';

export const sortDate = (a, b) => dayjs(a.date.start).diff(dayjs(b.date.start));
export const dateRend = (date, format) => dayjs(date).format(format);
