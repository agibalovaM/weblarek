import { Component } from './base/Component';

type GalleryData = {
  items: HTMLElement[];
};

/**
 * Представление каталога, отвечает за отображение списка карточек
 */
export class Gallery extends Component<GalleryData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(value: HTMLElement[]) {
    if (value?.length) {
      this.container.replaceChildren(...value);
      return;
    }
    this.container.replaceChildren();
  }
}
