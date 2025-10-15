import { Component } from './base/Component';

type HeaderData = { counter: number };

export class Header extends Component<HeaderData> {
  private basketButton: HTMLButtonElement;
  private counterElement: HTMLElement;
  private onBasketClickHandler: () => void = () => {};

  constructor(container: HTMLElement) {
    super(container);
    this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;

    // Один раз навешиваем слушатель
    this.basketButton?.addEventListener('click', () => this.onBasketClickHandler());
  }

  set counter(value: number) {
    if (this.counterElement) this.counterElement.textContent = String(value ?? 0);
  }

  onBasketClick(handler: () => void) {
    this.onBasketClickHandler = handler ?? (() => {});
  }
}
