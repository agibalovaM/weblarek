import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';

export type CardBaseData = {
  id: string;
  title: string;
  price: number | null;
  category?: string;
  image?: string;
};

export abstract class CardBase<T extends CardBaseData = CardBaseData> extends Component<T> {
  protected titleElement?: HTMLElement;
  protected priceElement?: HTMLElement;
  protected categoryElement?: HTMLElement;
  protected imageElement?: HTMLImageElement;

  private onClickHandler: () => void = () => {};

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = container.querySelector<HTMLElement>('.card__title') || undefined;
    this.priceElement = container.querySelector<HTMLElement>('.card__price') || undefined;
    this.categoryElement = container.querySelector<HTMLElement>('.card__category') || undefined;
    this.imageElement = container.querySelector<HTMLImageElement>('.card__image') || undefined;

    // общий клик по корню, если корневой элемент — <button>
    if (container instanceof HTMLButtonElement) {
      container.addEventListener('click', () => this.onClickHandler());
    }
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value ?? '';
    }
  }

  set price(value: number | null) {
    if (this.priceElement) {
      this.priceElement.textContent =
        value == null ? 'Бесценно' : `${value} синапсов`;
    }
  }

  set category(value: string) {
    if (!this.categoryElement) return;

    // берём из карты или используем «как есть» (fallback)
    const map = (value && categoryMap[value]) || { title: value ?? '', mod: value ?? '' };

    // текст бейджа
    this.categoryElement.textContent = map.title;

    // сбрасываем предыдущие модификаторы и ставим нужный
    this.categoryElement.className = 'card__category';
    if (map.mod) {
      this.categoryElement.classList.add(`card__category_${map.mod}`);
    }
  }
  
  set image(value: { src?: string; alt?: string; secondarySrc?: string; fallbackSrc?: string }) {
    const src = value?.src;
    const alt = value?.alt ?? '';
    if (this.imageElement && src) {
      const img = this.imageElement;
      // первая попытка — основной src
      img.onerror = null;
      if (value?.secondarySrc || value?.fallbackSrc) {
        img.onerror = () => {
          // вторая попытка — secondarySrc (например SVG)
          if (value?.secondarySrc && img.src !== value.secondarySrc) {
            img.onerror = () => {
              // третья попытка — fallback
              if (value?.fallbackSrc && img.src !== value.fallbackSrc) {
                img.src = value.fallbackSrc!;
              }
            };
            img.src = value.secondarySrc;
          } else if (value?.fallbackSrc && img.src !== value.fallbackSrc) {
            img.src = value.fallbackSrc;
          }
        };
      }
      this.setImage(img, src, alt);
    }
  }

  onClick(handler: () => void) {
    this.onClickHandler = handler ?? (() => {});
  }
}

