export const getCompletedOffers = (offers) => {
  const completedOffers = offers;
  for (let i = 0; i < completedOffers.length; i++) {
    if (typeof completedOffers[i].isChosen === 'undefined') {
      completedOffers[i].isChosen = false;
    }
  }

  return completedOffers;
};
