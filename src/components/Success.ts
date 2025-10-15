import { Component } from './base/Component';

type SuccessData = { amount: number };

export class Success extends Component<SuccessData> {
  private descriptionElement: HTMLElement;
  private closeButton: HTMLButtonElement;
  private onCloseHandler: () => void = () => {};

  constructor(container: HTMLElement) {
    super(container);
    this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
    this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

    this.closeButton?.addEventListener('click', () => this.onCloseHandler());
  }

  set amount(value: number) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = `Списано ${Number(value || 0)} синапсов`;
    }
  }

  onClose(handler: () => void) { this.onCloseHandler = handler ?? (() => {}); }
}
