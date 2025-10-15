import { FormBase } from './FormBase';

type ContactsData = { email: string; phone: string };

export class ContactsForm extends FormBase<ContactsData> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  private onInputEmailHandler: (v: string) => void = () => {};
  private onInputPhoneHandler: (v: string) => void = () => {};

  constructor(container: HTMLElement) {
    super(container);
    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

    this.emailInput?.addEventListener('input', () => this.onInputEmailHandler(this.emailInput.value));
    this.phoneInput?.addEventListener('input', () => this.onInputPhoneHandler(this.phoneInput.value));
  }

  set email(value: string) {
    if (this.emailInput) this.emailInput.value = value ?? '';
  }

  set phone(value: string) {
    if (this.phoneInput) this.phoneInput.value = value ?? '';
  }

  onInputEmail(handler: (v: string) => void) { this.onInputEmailHandler = handler ?? (() => {}); }
  onInputPhone(handler: (v: string) => void) { this.onInputPhoneHandler = handler ?? (() => {}); }
}
