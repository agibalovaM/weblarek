import { Component } from './base/Component';

type BasketData = {
  items: HTMLElement[];
  total: number;
  empty: boolean;
};

export class Basket extends Component<BasketData> {
  private listElement: HTMLUListElement;
  private totalElement: HTMLElement;
  private checkoutButton: HTMLButtonElement;

  private onCheckoutHandler: () => void = () => {};

  constructor(container: HTMLElement) {
    super(container);
    this.listElement = container.querySelector('.basket__list') as HTMLUListElement;
    this.totalElement = container.querySelector('.basket__price') as HTMLElement;
    this.checkoutButton = container.querySelector('.basket__button') as HTMLButtonElement;

    this.checkoutButton?.addEventListener('click', () => this.onCheckoutHandler());
  }

  set items(value: HTMLElement[]) {
    if (!value?.length) {
      // Если пусто — показываем «Корзина пуста»
      this.listElement.replaceChildren();
      const empty = document.createElement('li');
      empty.className = 'basket__item';
      empty.textContent = 'Корзина пуста';
      this.listElement.append(empty);
      return;
    }
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    if (this.totalElement) this.totalElement.textContent = `${Number(value || 0)} синапсов`;
  }

  set empty(value: boolean) {
    this.checkoutButton.disabled = !!value;
    if (value) this.items = []; // визуально показываем «Корзина пуста»
  }

  onCheckout(handler: () => void) { this.onCheckoutHandler = handler ?? (() => {}); }
}
