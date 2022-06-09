import EventEditView from '../view/event-edit-view.js';
import WaypointView from '../view/waypoint-view.js';
import {render, replace, remove} from '../render.js';
import {UserAction, UpdateType, Mode, State, RenderPosition} from '../consts.js';
import {datesAreSame} from '../utils/common.js';

export default class PointPresenter {
    #eventsListContainer = null;
    #changeData = null;
    #changeMode = null;

    #waypointComponent = null;
    #eventEditComponent = null;
    #point = null;
    #mode = Mode.DEFAULT;

    #destinations = null;
    #allOffers = null;

    constructor(eventsListContainer, changeData, changeMode, destinations, allOffers) {
      this.#eventsListContainer = eventsListContainer;
      this.#changeData = changeData;
      this.#changeMode = changeMode;
      this.#destinations = destinations;
      this.#allOffers = allOffers;
    }

    init = (point) => {
      this.#point = point;

      const prevWaypointComponent = this.#waypointComponent;
      const prevEventEditComponent = this.#eventEditComponent;

      this.#waypointComponent =  new WaypointView(point);
      this.#eventEditComponent = new EventEditView(point, this.#destinations, this.#allOffers);

      this.#waypointComponent.setEditClickHandler(this.#handleEditClick);
      this.#waypointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

      this.#eventEditComponent.setRollupClickHandler(this.#handleRollupClick);
      this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
      this.#eventEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

      if (prevWaypointComponent === null || prevEventEditComponent === null) {
        render(this.#eventsListContainer, this.#waypointComponent, RenderPosition.BEFOREEND);
        return;
      }

      if (this.#mode === Mode.DEFAULT) {
        replace(this.#waypointComponent, prevWaypointComponent);
      }

      if (this.#mode === Mode.EDITING) {
        replace(this.#waypointComponent, prevEventEditComponent);
        this.#mode = Mode.DEFAULT;
      }

      remove(prevWaypointComponent);
      remove(prevEventEditComponent);
    };

    destroy = () => {
      remove(this.#waypointComponent);
      remove(this.#eventEditComponent);
    };

    resetView = () => {
      if (this.#mode !== Mode.DEFAULT) {
        this.#eventEditComponent.reset(this.#point);
        this.#replaceFormToItem();
      }
    };

    #escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#eventEditComponent.reset(this.#point);
        this.#replaceFormToItem();
      }
    };

    #replaceItemToForm = () => {
      replace(this.#eventEditComponent, this.#waypointComponent);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      this.#changeMode();
      this.#mode = Mode.EDITING;
    };

    #replaceFormToItem = () => {
      replace(this.#waypointComponent, this.#eventEditComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#mode = Mode.DEFAULT;
    };

    #handleFavoriteClick = () => {
      this.#changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        {...this.#point, isFavorite: !this.#point.isFavorite},
      );
    };

    #handleFormSubmit = (update) => {
      const isMinorUpdate =
         !datesAreSame(this.#point.dateFrom, update.dateFrom) ||
         !datesAreSame(this.#point.dateTo, update.dateTo) ||
         (this.#point.basePrice !== update.basePrice);

      this.#changeData(
        UserAction.UPDATE_POINT,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update,
      );
    };

    #handleEditClick = () => {
      this.#replaceItemToForm();
    };

    #handleRollupClick = () => {
      this.#eventEditComponent.reset(this.#point);
      this.#replaceFormToItem();
    };

    #handleDeleteClick = (task) => {
      this.#changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        task,
      );
    };

    setViewState = (state) => {
      if (this.#mode === Mode.DEFAULT) {
        return;
      }

      const resetFormState = () => {
        this.#eventEditComponent.updateData({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      };

      switch (state) {
        case State.SAVING:
          this.#eventEditComponent.updateData({
            isDisabled: true,
            isSaving: true,
          });
          break;
        case State.DELETING:
          this.#eventEditComponent.updateData({
            isDisabled: true,
            isDeleting: true,
          });
          break;
        case State.ABORTING:
          this.#waypointComponent.shake(resetFormState);
          this.#eventEditComponent.shake(resetFormState);
          break;
      }
    };
}
