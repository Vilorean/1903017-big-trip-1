import WaypointView from '../view/waypoint-view';
import EventEditView from '../view/event-edit-view';
import { render, RenderPosition, replace, remove } from '../render';

export default class PointPresenter {
    #tripPointsListElement = null;

    #waypointComponent = null;
    #eventEditComponent = null;

    #point = null;

    constructor(tripPointsListElement) {
      this.#tripPointsListElement = tripPointsListElement;
    }

    init = (point) => {
      this.#point = point;

      const prevWaypointComponent = this.#waypointComponent;
      const prevEventEditComponent = this.#eventEditComponent;

      this.#waypointComponent =  new WaypointView(point);
      this.#eventEditComponent = new EventEditView(point);

      this.#waypointComponent.setEditClickHandler(this.#handleEditClick);
      this.#eventEditComponent.setRollupClickHandler(this.#handleRollupClick);
      this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

      if (prevWaypointComponent === null || prevEventEditComponent === null) {
        render(this.#tripPointsListElement, this.#waypointComponent, RenderPosition.BEFOREEND);
        return;
      }

      if (this.#tripPointsListElement.element.contains(prevWaypointComponent.element)) {
        replace(this.#waypointComponent, prevWaypointComponent);
      }

      if (this.#tripPointsListElement.element.contains(prevEventEditComponent.element)) {
        replace(this.#eventEditComponent, prevEventEditComponent);
      }

      remove(prevWaypointComponent);
      remove(prevEventEditComponent);
    }

    destroy = () => {
      remove(this.#waypointComponent);
      remove(this.#eventEditComponent);
    }

    #replaceItemToForm = () => {
      replace(this.#eventEditComponent, this.#waypointComponent);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    }

    #replaceFormToItem = () => {
      replace(this.#waypointComponent, this.#eventEditComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
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

    #handleFormSubmit = () => {
      this.#replaceFormToItem();
    };
}

