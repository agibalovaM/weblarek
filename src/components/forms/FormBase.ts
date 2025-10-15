import { Component } from '../base/Component';

type FormBaseData = {
  errors: string | null;
  canSubmit: boolean;
};

export abstract class FormBase<T extends object = FormBaseData> extends Component<T & FormBaseData> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  private onSubmitHandler: () => void = () => {};

  constructor(container: HTMLElement) {
    super(container);
    //поддерживаем случай, когда container — это сам <form>
    this.formElement = (
    container instanceof HTMLFormElement
      ? container
      : (container.querySelector('form') as HTMLFormElement)
  );
    this.submitButton = container.querySelector('button[type="submit"], .order__button') as HTMLButtonElement;
    this.errorsElement = container.querySelector('.form__errors') as HTMLElement;

    this.formElement?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmitHandler();
    });
  }

  set errors(value: string | null) {
    if (!this.errorsElement) return;
    this.errorsElement.textContent = value ?? '';
  }

  set canSubmit(value: boolean) {
    if (this.submitButton) this.submitButton.disabled = !value;
  }

  onSubmit(handler: () => void) { this.onSubmitHandler = handler ?? (() => {}); }
}

