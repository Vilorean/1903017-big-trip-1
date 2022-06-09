import EventAddView from '../view/event-add-view.js';
import {UserAction, UpdateType, RenderPosition} from '../consts.js';
import {remove, render} from '../render.js';

export default class PointNewPresenter {
    #eventsListContainer = null;
    #changeData = null;
    #eventAddComponent = null;
    #destroyCallback = null;
    #destinations = null;
    #allOffers = null;

    constructor(eventsListContainer, changeData) {
      this.#eventsListContainer = eventsListContainer;
      this.#changeData = changeData;
    }

    init = (callback, destinations, allOffers) => {
      this.#destroyCallback = callback;

      if (this.#eventAddComponent !== null) {
        return;
      }

      this.#destinations = destinations;
      this.#allOffers = allOffers;

      this.#eventAddComponent = new EventAddView(this.#destinations, this.#allOffers);
      this.#eventAddComponent.setFormSubmitHandler(this.#handleFormSubmit);
      this.#eventAddComponent.setDeleteClickHandler(this.#handleDeleteClick);

      render(this.#eventsListContainer, this.#eventAddComponent, RenderPosition.AFTERBEGIN);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    };

    destroy = () => {
      if (this.#eventAddComponent === null) {
        return;
      }

      this.#destroyCallback?.();
      remove(this.#eventAddComponent);
      this.#eventAddComponent = null;

      document.removeEventListener('keydown', this.#escKeyDownHandler);
      document.querySelector('.trip-main__event-add-btn').disabled = false;
    };

    #escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.destroy();
      }
    };

    #handleDeleteClick = () => {
      this.destroy();
    };

    #handleFormSubmit = (point) => {
      this.#changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
      );
      document.querySelector('.trip-main__event-add-btn').disabled = false;
    };

    setSaving = () => {
      this.#eventAddComponent.updateData({
        isDisabled: true,
        isSaving: true,
      });
    };

    setAborting = () => {
      const resetFormState = () => {
        this.#eventAddComponent.updateData({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      };

      this.#eventAddComponent.shake(resetFormState);
    };
}
