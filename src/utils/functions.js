const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateImages = () => {
  const arrayOfImages = [];
  for (let i = 0; i < 5; i++) {
    arrayOfImages[i] = 'http://picsum.photos/248/152?';
    arrayOfImages[i]+= getRandomInteger(0, 99).toString();
  }
  return arrayOfImages;
};
