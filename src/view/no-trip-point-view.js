import {createElement} from '../render.js';

const createNoTripPointTemplate = () => (
  `<p class="trip-events__msg">
    Click New Event to create your first point
    </p>`
);

export default class NoTripPointView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoTripPointTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
