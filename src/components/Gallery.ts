import { Component } from './base/Component';

type GalleryData = { catalog: HTMLElement[] };

export class Gallery extends Component<GalleryData> {
  private catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = container; // <main class="gallery"> сам контейнер — это список
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...(items ?? []));
  }
}
