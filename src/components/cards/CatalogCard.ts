import { CardBase, CardBaseData } from './CardBase';

export class CatalogCard extends CardBase<CardBaseData> {
  // Корень — <button class="gallery__item card">
  constructor(container: HTMLButtonElement) {
    super(container);
  }
}
