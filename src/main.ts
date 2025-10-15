// src/main.ts
import './scss/styles.scss';

import { Api } from './components/base/Api';
import { ShopAPI } from './components/base/ShopAPI';

import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { BuyerData } from './components/Models/BuyerData';

import { CatalogCard } from './components/cards/CatalogCard';
import { OrderForm } from './components/forms/OrderForm';
import { ContactsForm } from './components/forms/ContactsForm';

import type { IProduct } from './types';

import { CDN_URL } from './utils/constants';

// origin и фолбэк
const ORIGIN = (import.meta.env.VITE_API_ORIGIN as string).replace(/\/$/, '');
const FALLBACK_IMG = new URL('./images/Subtract.svg', import.meta.url).href;

/** Собираем абсолютный URL к картинке, используя CDN_URL */
function toCdnUrl(raw?: string | null): string {
  const s = (raw ?? '').trim();
  if (!s) return '';

  // уже абсолютный URL
  if (/^https?:\/\//i.test(s)) return s;

  // путь от корня сервера (например /content/weblarek/xxx.svg)
  if (s.startsWith('/')) return `${ORIGIN}${s}`;

  // относительные варианты из API
  if (s.startsWith('content/')) return `${ORIGIN}/${s}`;
  if (s.startsWith('weblarek/')) return `${CDN_URL}/${s.slice('weblarek/'.length)}`;

  // обычный случай: только имя файла
  return `${CDN_URL}/${encodeURIComponent(s)}`;
}

/** Сначала пробуем .png (как в макете), если 404 — откатываемся на .svg */
function preferPng(raw?: string | null) {
  const svg = toCdnUrl(raw);
  if (!svg) return { png: FALLBACK_IMG, svg: FALLBACK_IMG };
  const png = svg.replace(/\.svg(\?.*)?$/i, '.png$1');
  return { png, svg };
}

// modal helpers 
const modal = document.getElementById('modal-container') as HTMLDivElement;
const modalContent = modal.querySelector('.modal__content') as HTMLDivElement;
const modalClose = modal.querySelector('.modal__close') as HTMLButtonElement;

// закрывать по клику вне модального окна 
modal.addEventListener('mousedown', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function openModal(node: HTMLElement) {
  modalContent.innerHTML = '';
  modalContent.appendChild(node);
  modal.classList.add('modal_active');
  // блокируем скролл страницы, пока открыта модалка
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('modal_active');
  modalContent.innerHTML = '';
  // возвращаем скролл
  document.body.style.overflow = '';
}

// крестик
modalClose.addEventListener('click', closeModal);


// common DOM refs 
const $gallery = document.querySelector('.gallery')!;
const $basketBtn = document.querySelector('.header__basket') as HTMLButtonElement;
const $basketCounter = document.querySelector('.header__basket-counter')!;

// models 
const catalog = new Catalog();
const cart = new Cart();
const buyer = new BuyerData({ payment: '', address: '', email: '', phone: '' });

// api 
const api = new Api(import.meta.env.VITE_API_ORIGIN, {
  headers: { 'Content-Type': 'application/json' }
});
const shopApi = new ShopAPI(api);

// view renderers (без генерации событий) 
function renderCatalog(items: IProduct[]) {
  $gallery.innerHTML = '';
  const tpl = document.getElementById('card-catalog') as HTMLTemplateElement;

  const nodes = items.map((product) => {
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLButtonElement;
    const card = new CatalogCard(node);

    card.onClick(() => catalog.saveSelectedProduct(product));

    const el = card.render({
      title: product.title,
      category: product.category,
      price: product.price ?? null,
    });
    // у каждой карточки своя картинка: сначала .png, при ошибке → .svg, потом → FALLBACK
    const { png, svg } = preferPng(product.image);
    card.image = { src: png, alt: product.title || '' };

    const imgEl = node.querySelector('.card__image') as HTMLImageElement;
    imgEl.onerror = () => {
    imgEl.onerror = () => { imgEl.src = FALLBACK_IMG; }; // если и .svg не найдётся
    imgEl.src = svg;// png → svg
};

    return el;
  });

  $gallery.append(...nodes);
}

function openPreview(product: IProduct) {
  const tpl = document.getElementById('card-preview') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;

  const img = node.querySelector('.card__image') as HTMLImageElement;
  const { png, svg } = preferPng(product.image);
  img.src = png;
  img.alt = product.title || 'Товар';
  img.onerror = () => {
  img.onerror = () => { img.src = FALLBACK_IMG; };
  img.src = svg;
};


  (node.querySelector('.card__title') as HTMLElement).textContent = product.title;
  (node.querySelector('.card__category') as HTMLElement).textContent = product.category;

  // берём описание из данных товара
  const desc = product.description ?? product.text ?? product.about ?? '';
  (node.querySelector('.card__text') as HTMLElement).textContent = desc;

  (node.querySelector('.card__price') as HTMLElement).textContent =
    product.price != null ? `${product.price} синапсов` : 'Бесценно';

  const btn = node.querySelector('.card__button') as HTMLButtonElement;

  if (product.price == null) {
    btn.textContent = 'Недоступно';
    btn.disabled = true;
    btn.classList.add('button_disabled');
  } else {
    const refresh = () => {
      const inCart = cart.hasProduct(product.id);
      btn.textContent = inCart ? 'Удалить из корзины' : 'В корзину';
      btn.classList.toggle('button_alt', inCart);
      btn.disabled = false;
    };

    btn.addEventListener('click', () => {
      const inCart = cart.hasProduct(product.id);
      inCart ? cart.removeProduct(product.id) : cart.addProduct(product);
      closeModal();
    });

    const unsub = cart.events.on('cart:changed', refresh);
    modalClose.addEventListener('click', () => unsub(), { once: true });

    refresh();
  }

  openModal(node);
}

function openBasket() {
  const tpl = document.getElementById('basket') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const list = node.querySelector('.basket__list') as HTMLElement;
  const priceEl = node.querySelector('.basket__price') as HTMLElement;
  const orderBtn = node.querySelector('.basket__button') as HTMLButtonElement;
  const itemTpl = document.getElementById('card-basket') as HTMLTemplateElement;

  const renderList = () => {
    list.innerHTML = '';

    const products = cart.getProducts();
    if (products.length === 0) {
      // пустое состояние
      const empty = document.createElement('li');
      empty.className = 'basket__empty';
      empty.textContent = 'Корзина пуста';
      list.appendChild(empty);

      priceEl.textContent = '0 синапсов';
      orderBtn.disabled = true;
      orderBtn.classList.add('button_disabled');
      $basketCounter.textContent = '0';
      return;
    }

    // есть товары
    products.forEach((p, idx) => {
      const li = itemTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
      (li.querySelector('.basket__item-index') as HTMLElement).textContent = String(idx + 1);
      (li.querySelector('.card__title') as HTMLElement).textContent = p.title;
      (li.querySelector('.card__price') as HTMLElement).textContent =
        p.price != null ? `${p.price} синапсов` : 'Бесценно';
      (li.querySelector('.basket__item-delete') as HTMLButtonElement)
        .addEventListener('click', () => cart.removeProduct(p.id));
      list.appendChild(li);
    });

    priceEl.textContent = `${cart.getTotalPrice()} синапсов`;
    orderBtn.disabled = false;
    orderBtn.classList.remove('button_disabled');
    $basketCounter.textContent = String(cart.getProductCount());
  };

  openModal(node);
  renderList();

  const unsub = cart.events.on('cart:changed', renderList);
  modalClose.addEventListener('click', () => unsub(), { once: true });

  orderBtn.addEventListener('click', openOrder);
}

function openOrder() {
  const tpl = document.getElementById('order') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const form = new OrderForm(node);

  openModal(node);

  // локально храним значения, источником правды остаётся модель buyer
  let payment = buyer.payment || '';
  let address = buyer.address || '';

  form.payment = payment;
  form.address = address;
  validate();

  form.onSelectPayment((v) => {
    payment = v;
    form.payment = v;
    buyer.updateField('payment', v); // → buyer:changed
    validate();
  });

  form.onInputAddress((v) => {
    address = v;
    buyer.updateField('address', v); // → buyer:changed
    validate();
  });

  form.onSubmit(() => openContacts());

  function validate() {
    const ok = payment !== '' && address.trim().length >= 5;
    form.errors = ok ? null : 'Выберите способ оплаты и укажите адрес (≥5 символов)';
    form.canSubmit = ok;
  }
}

function openContacts() {
  const tpl = document.getElementById('contacts') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const form = new ContactsForm(node);

  openModal(node);

  let email = buyer.email || '';
  let phone = buyer.phone || '';

  form.email = email;
  form.phone = phone;
  validate();

  form.onInputEmail((v) => { email = v; buyer.updateField('email', v); validate(); });
  form.onInputPhone((v) => { phone = v; buyer.updateField('phone', v); validate(); });

  // защита от двойного сабмита
  let submitting = false;
  form.onSubmit(handlePay);

  function validate() {
    const emailOk = /\S+@\S+\.\S+/.test(email);
    const phoneOk = phone.replace(/[^\d+]/g, '').length >= 7;
    if (!emailOk) { form.errors = 'Неверный email'; form.canSubmit = false; return; }
    if (!phoneOk) { form.errors = 'Неверный телефон'; form.canSubmit = false; return; }
    form.errors = null; form.canSubmit = true;
  }

  async function handlePay() {
    if (submitting) return;
    submitting = true;
    form.canSubmit = false;
    form.errors = null;

    const order = {
      payment: buyer.payment as 'card' | 'cash',
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      total: cart.getTotalPrice(),
      items: cart.getProducts().map((p) => p.id),
    };

    try {
      const res = await shopApi.createOrder(order);
      console.log('[ORDER OK]', res);
    } catch (e) {
      console.warn('[ORDER FAIL] API недоступен, покажем success локально', e);
    } finally {
      const total = order.total;
      cart.clear();// → cart:changed (корзина станет пустой)
      buyer.clear();
      openSuccess(total);// всегда откроем окно «Заказ оформлен»
      submitting = false;
    }
  }
}

function openSuccess(total: number) {
  const tpl = document.getElementById('success') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const sumEl = node.querySelector('.order-success__description');
  if (sumEl) sumEl.textContent = `Списано ${total} синапсов`;

  (node.querySelector('.order-success__close') as HTMLButtonElement)
    .addEventListener('click', closeModal);

  openModal(node);
}

//подписки презентера
catalog.events.on<IProduct[]>('catalog:changed', (items) => {
  renderCatalog(items ?? catalog.getProducts());
});

catalog.events.on<IProduct>('catalog:selected', (product) => {
  if (product) openPreview(product);
});

cart.events.on('cart:changed', (snap) => {
  $basketCounter.textContent = String(snap?.count ?? cart.getProductCount());
});

// кнопка открытия корзины (событие представления)
$basketBtn.addEventListener('click', openBasket);

//загрузка данных (единственное место вне презентера)
(async () => {
  try {
    const resp = await shopApi.getProducts();
    catalog.saveProducts(resp.items); // → 'catalog:changed' → renderCatalog
  } catch (e) {
    console.error('Не удалось загрузить товары', e);
  }
})();









