import { FormBase } from './FormBase';

type Payment = 'card' | 'cash' | '';
type OrderData = { payment: Payment; address: string };

export class OrderForm extends FormBase<OrderData> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  private onSelectPaymentHandler: (v: Exclude<Payment, ''>) => void = () => {};
  private onInputAddressHandler: (v: string) => void = () => {};

  constructor(container: HTMLElement) {
    super(container);
    this.cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
    this.cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

    this.cardButton?.addEventListener('click', () => this.onSelectPaymentHandler('card'));
    this.cashButton?.addEventListener('click', () => this.onSelectPaymentHandler('cash'));
    this.addressInput?.addEventListener('input', () => this.onInputAddressHandler(this.addressInput.value));
  }

  set payment(value: Payment) {
    // визуальное выделение выбранной кнопки
    [this.cardButton, this.cashButton].forEach((btn) => btn?.classList.remove('button_alt-active'));
    if (value === 'card') this.cardButton?.classList.add('button_alt-active');
    if (value === 'cash') this.cashButton?.classList.add('button_alt-active');
  }

  set address(value: string) {
    if (this.addressInput) this.addressInput.value = value ?? '';
  }

  onSelectPayment(handler: (v: 'card' | 'cash') => void) {
    this.onSelectPaymentHandler = handler ?? (() => {});
  }

  onInputAddress(handler: (v: string) => void) {
    this.onInputAddressHandler = handler ?? (() => {});
  }
}
