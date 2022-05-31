import WaypointView from '../view/waypoint-view.js';
import EventEditView from '../view/event-edit-view.js';
import { render, RenderPosition, replace, remove } from '../render.js';
import { UserAction, UpdateType } from '../utils/sort-consts.js';
import { isDatesEqual } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};


export default class PointPresenter {
    #waypointListContainer = null;
    #changeData = null;
    #changeMode = null;

    #waypointComponent = null;
    #eventEditComponent = null;

    #point = null;
    #mode = Mode.DEFAULT;

    constructor(waypointListContainer, changeData, changeMode) {
      this.#waypointListContainer = waypointListContainer;
      this.#changeData = changeData;
      this.#changeMode = changeMode;
    }

    init = (point) => {
      this.#point = point;

      const prevWaypointComponent = this.#waypointComponent;
      const prevEventEditComponent = this.#eventEditComponent;

      this.#waypointComponent =  new WaypointView(point);
      this.#eventEditComponent = new EventEditView(point);

      this.#waypointComponent.setEditClickHandler(this.#handleEditClick);
      this.#waypointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
      this.#eventEditComponent.setRollupClickHandler(this.#handleRollupClick);
      this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
      this.#eventEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

      if (prevWaypointComponent === null || prevEventEditComponent === null) {
        render(this.#waypointListContainer, this.#waypointComponent, RenderPosition.BEFOREEND);
        return;
      }

      if (this.#mode === Mode.DEFAULT) {
        replace(this.#waypointComponent, prevWaypointComponent);
      }

      if (this.#mode === Mode.EDITING) {
        replace(this.#eventEditComponent, prevEventEditComponent);
      }

      remove(prevWaypointComponent);
      remove(prevEventEditComponent);
    }

    destroy = () => {
      remove(this.#waypointComponent);
      remove(this.#eventEditComponent);
    }

    resetView = () => {
      if (this.#mode !== Mode.DEFAULT) {
        this.#eventEditComponent.reset(this.#point);
        this.#replaceFormToItem();
      }
    }

    #replaceItemToForm = () => {
      replace(this.#eventEditComponent, this.#waypointComponent);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      this.#changeMode();
      this.#mode = Mode.EDITING;
    }

    #replaceFormToItem = () => {
      replace(this.#waypointComponent, this.#eventEditComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      this.#mode = Mode.DEFAULT;
    }

    #escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.#eventEditComponent.reset(this.#point);
        this.#replaceFormToItem();
      }
    };

    #handleEditClick = () => {
      this.#replaceItemToForm();
    };

    #handleRollupClick = () => {
      this.#eventEditComponent.reset(this.#point);
      this.#replaceFormToItem();
    };

    #handleFavoriteClick = () => {
      this.#changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        {...this.#point, isFavorite: !this.#point.isFavorite},
      );
    }

      #handleFormSubmit = (update) => {
        const isMinorUpdate =
         !isDatesEqual(this.#point.dateFrom, update.dateFrom) ||
         !isDatesEqual(this.#point.dateTo, update.dateTo) ||
         (this.#point.basePrice !== update.basePrice);

        this.#changeData(
          UserAction.UPDATE_POINT,
          isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
          update,
        );
        this.#replaceFormToItem();
      }

      #handleDeleteClick = (task) => {
        this.#changeData(
          UserAction.DELETE_POINT,
          UpdateType.MINOR,
          task,
        );
      }
}

