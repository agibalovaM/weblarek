import { Component } from './base/Component';
import { MODAL_ACTIVE_CLASS } from '../utils/constants';

type ModalData = { content: HTMLElement };

export class Modal extends Component<ModalData> {
  private modalElement: HTMLElement;
  private containerElement: HTMLElement;
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  private onOpen: () => void = () => {};
  private onClose: () => void = () => {};

  constructor(container: HTMLElement) {
    super(container);
    this.modalElement = container; // div.modal
    this.containerElement = container.querySelector('.modal__container') as HTMLElement;
    this.contentElement = container.querySelector('.modal__content') as HTMLElement;
    this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;

    // Закрытие по крестику
    this.closeButton?.addEventListener('click', () => this.close());
    // Закрытие по клику вне коробки
    this.modalElement?.addEventListener('mousedown', (e) => {
      if (!this.containerElement.contains(e.target as Node)) this.close();
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open() {
    this.modalElement.classList.add(MODAL_ACTIVE_CLASS);
    document.body.style.overflow = 'hidden';
    this.onOpen();
  }

  close() {
    this.modalElement.classList.remove(MODAL_ACTIVE_CLASS);
    document.body.style.overflow = '';
    this.contentElement.replaceChildren();
    this.onClose();
  }

  onOpened(handler: () => void) { this.onOpen = handler ?? (() => {}); }
  onClosed(handler: () => void) { this.onClose = handler ?? (() => {}); }
}
