import { CardBase, CardBaseData } from './CardBase';

type BasketItemData = CardBaseData & { index: number };

export class BasketItem extends CardBase<BasketItemData> {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  private onDeleteHandler: () => void = () => {};

  constructor(container: HTMLElement) {
    super(container);
    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteButton?.addEventListener('click', () => this.onDeleteHandler());
  }

  set index(value: number) {
    if (this.indexElement) this.indexElement.textContent = String(value ?? 0);
  }

  onDelete(handler: () => void) { this.onDeleteHandler = handler ?? (() => {}); }
}
