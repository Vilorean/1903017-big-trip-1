import WaypointView from '../view/waypoint-view';
import EventEditView from '../view/event-edit-view';
import { render, RenderPosition, replace, remove } from '../render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};


export default class PointPresenter {
    #tripPointsListElement = null;
    #changeData = null;
    #changeMode = null;

    #waypointComponent = null;
    #eventEditComponent = null;

    #point = null;
    #mode = Mode.DEFAULT;

    constructor(tripPointsListElement, changeData, changeMode) {
      this.#tripPointsListElement = tripPointsListElement;
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

      if (prevWaypointComponent === null || prevEventEditComponent === null) {
        render(this.#tripPointsListElement, this.#waypointComponent, RenderPosition.BEFOREEND);
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
        this.#replaceFormToItem();
      }
    };

    #handleEditClick = () => {
      this.#replaceItemToForm();
    };

    #handleRollupClick = () => {
      this.#replaceFormToItem();
    };

    #handleFavoriteClick = () => {
      this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
    }

      #handleFormSubmit = (point) => {
        this.#changeData(point);
        this.#replaceFormToItem();
      };
}

