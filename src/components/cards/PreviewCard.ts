import { CardBase, CardBaseData } from './CardBase';

type PreviewData = CardBaseData & {
  description: string;
  inCart: boolean;
};

export class PreviewCard extends CardBase<PreviewData> {
  private textElement: HTMLElement;
  private actionButton: HTMLButtonElement;

  private onActionHandler: () => void = () => {};

  constructor(container: HTMLElement) {
    super(container);
    this.textElement = container.querySelector('.card__text') as HTMLElement;
    this.actionButton = container.querySelector('.card__button') as HTMLButtonElement;

    this.actionButton?.addEventListener('click', () => this.onActionHandler());
  }

  set description(value: string) {
    if (this.textElement) this.textElement.textContent = value ?? '';
  }

  set inCart(value: boolean) {
    if (this.actionButton) this.actionButton.textContent = value ? 'Удалить из корзины' : 'В корзину';
  }

  // доступность покупки (нет цены → Недоступно)
  set available(value: boolean) {
    if (!this.actionButton) return;
    if (value) {
      this.actionButton.disabled = false;
      // текст оставляет текущий (В корзину/Удалить), им управляет inCart
    } else {
      this.actionButton.disabled = true;
      this.actionButton.textContent = 'Недоступно';
    }
  }

  onAction(handler: () => void) { this.onActionHandler = handler ?? (() => {}); }
}
