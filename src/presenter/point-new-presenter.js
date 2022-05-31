import PointAddView from '../view/event-add-view.js';
import { nanoid } from 'nanoid';
import { remove, render, RenderPosition } from '../render';
import { UserAction, UpdateType } from '../utils/sort-consts.js';

export default class PointNewPresenter {
    #pointListContainer = null;
    #changeData = null;
    #pointAddComponent = null;
    #destroyCallback = null;

    constructor(pointListContainer, changeData) {
      this.#pointListContainer = pointListContainer;
      this.#changeData = changeData;
    }

    init = (callback) => {
      this.#destroyCallback = callback;

      if (this.#pointAddComponent !== null) {
        return;
      }

      this.#pointAddComponent = new PointAddView();
      this.#pointAddComponent.setFormSubmitHandler(this.#handleFormSubmit);
      this.#pointAddComponent.setDeleteClickHandler(this.#handleDeleteClick);

      render(this.#pointListContainer, this.#pointAddComponent, RenderPosition.AFTERBEGIN);

      document.addEventListener('keydown', this.#escKeyDownHandler);
    }

    destroy = () => {
      if (this.#pointAddComponent === null) {
        return;
      }

      this.#destroyCallback?.();
      remove(this.#pointAddComponent);
      this.#pointAddComponent = null;

      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }

    #handleFormSubmit = (point) => {
      this.#changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        // Пока у нас нет сервера, который бы после сохранения
        // выдывал честный id задачи, нам нужно позаботиться об этом самим
        {id: nanoid(), ...point},
      );
      this.destroy();
    }

    #handleDeleteClick = () => {
      this.destroy();
    }

    #escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        this.destroy();
      }
    }
}

