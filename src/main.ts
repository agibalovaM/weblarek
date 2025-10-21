// src/main.ts
import './scss/styles.scss';

import { Api } from './components/base/Api';
import { ShopAPI } from './components/base/ShopAPI';

import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { BuyerData } from './components/Models/BuyerData';

import { CatalogCard } from './components/cards/CatalogCard';
import { PreviewCard } from './components/cards/PreviewCard';
import { BasketItem } from './components/cards/BasketItem';
import { OrderForm } from './components/forms/OrderForm';
import { ContactsForm } from './components/forms/ContactsForm';

import { Gallery } from './components/Gallery';
import { Modal } from './components/Modal';
import { Header } from './components/Header';
import { Basket } from './components/Basket';
import { Success } from './components/Success';

import { preferPng, FALLBACK_IMG } from './utils/images';
import type { IProduct } from './types';

//корневые контейнеры
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);

//представления верхнего уровня 
const modal = new Modal(document.getElementById('modal-container') as HTMLDivElement);
const header = new Header(document.querySelector('.header') as HTMLElement);
header.onBasketClick(() => openBasket());
header.counter = 0;

// models 
const catalog = new Catalog();
const cart = new Cart();
const buyer = new BuyerData({ payment: '', address: '', email: '', phone: '' });

// api 
const api = new Api(import.meta.env.VITE_API_ORIGIN, {
  headers: { 'Content-Type': 'application/json' }
});
const shopApi = new ShopAPI(api);

// рендер каталога через представления карточек
function renderCatalog(items: IProduct[]) {
  const tpl = document.getElementById('card-catalog') as HTMLTemplateElement;

  const nodes = items.map((product) => {
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLButtonElement;
    const card = new CatalogCard(node);

    card.onClick(() => catalog.saveSelectedProduct(product));

    const { png, svg } = preferPng(product.image);
    const el = card.render({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price ?? null,
    });
    
    card.image = { src: png, secondarySrc: svg, fallbackSrc: FALLBACK_IMG, alt: product.title || '' };

    return el;
  });

  gallery.items = nodes;
}

// превью товара через PreviewCard 
function openPreview(product: IProduct) {
  const tpl = document.getElementById('card-preview') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const card = new PreviewCard(node);

  const { png, svg } = preferPng(product.image);
  card.render({
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price ?? null,
    description: product.description ?? '',
    inCart: cart.hasProduct(product.id),
  });
  card.image = { src: png, secondarySrc: svg, fallbackSrc: FALLBACK_IMG, alt: product.title || '' };
  card.available = product.price != null;

  card.onAction(() => {
    cart.hasProduct(product.id) ? cart.removeProduct(product.id) : cart.addProduct(product);
    modal.close(); // по ТЗ — закрыть после действия
  });

  modal.content = node;
  modal.open();
}

// корзина через Basket + BasketItem 
function openBasket() {
  const tpl = document.getElementById('basket') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const basketView = new Basket(node);
  const itemTpl = document.getElementById('card-basket') as HTMLTemplateElement;

  const render = () => {
    const items = cart.getProducts().map((p, idx) => {
      const li = itemTpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const item = new BasketItem(li);
      item.render({
        id: p.id,
        title: p.title,
        price: p.price ?? null,
        index: idx + 1,
      });
      item.onDelete(() => cart.removeProduct(p.id));
      return li;
    });

    basketView.items = items;
    basketView.total = cart.getTotalPrice();
    basketView.empty = items.length === 0;
    header.counter = cart.getProductCount();
  };

  basketView.onCheckout(() => openOrder());

  modal.content = node;
  modal.open();
  render();

  const off = cart.events.on('cart:changed', render);
  modal.onClosed(off); // отписка при закрытии
}

// шаг 1 заказа — валидация через модель BuyerData 
function openOrder() {
  const tpl = document.getElementById('order') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const form = new OrderForm(node);

  form.payment = buyer.payment;
  form.address = buyer.address;
  sync();

  form.onSelectPayment((v) => { buyer.updateField('payment', v); sync(); });
  form.onInputAddress((v) => { buyer.updateField('address', v); sync(); });
  form.onSubmit(() => openContacts());

  modal.content = node;
  modal.open();

  function sync() {
    const f = buyer.validateFields();
    form.errors = !f.payment ? 'Выберите способ оплаты'
               : !f.address ? 'Укажите адрес доставки'
               : null;
    form.canSubmit = f.payment && f.address;
  }
}

//  шаг 2 заказа — валидация через модель BuyerData 
function openContacts() {
  const tpl = document.getElementById('contacts') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const form = new ContactsForm(node);

  form.email = buyer.email;
  form.phone = buyer.phone;
  sync();

  form.onInputEmail((v) => { buyer.updateField('email', v); sync(); });
  form.onInputPhone((v) => { buyer.updateField('phone', v); sync(); });

  let submitting = false;
  form.onSubmit(handlePay);

  modal.content = node;
  modal.open();

  function sync() {
    const f = buyer.validateFields();
    form.errors = !f.email ? 'Неверный email'
               : !f.phone ? 'Неверный телефон'
               : null;
    form.canSubmit = f.email && f.phone;
  }

  async function handlePay() {
    if (submitting) return;
    if (!buyer.validate()) { sync(); return; }

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

    try { await shopApi.createOrder(order); }
    catch { /* допускаем оффлайн success */ }
    finally {
      const total = order.total;
      cart.clear();
      buyer.clear();
      openSuccess(total);
      submitting = false;
    }
  }
}

// success-модалка через представление Success
function openSuccess(total: number) {
  const tpl = document.getElementById('success') as HTMLTemplateElement;
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const success = new Success(node);

  success.amount = total;
  success.onClose(() => modal.close());

  modal.content = node;
  modal.open();
}

//  подписки презентера 
catalog.events.on<IProduct[]>('catalog:changed', (items) => {
  renderCatalog(items ?? catalog.getProducts());
});

catalog.events.on<IProduct>('catalog:selected', (product) => {
  if (product) openPreview(product);
});

cart.events.on('cart:changed', (snap) => {
  header.counter = snap?.count ?? cart.getProductCount();
});

//  загрузка данных 
(async () => {
  try {
    const resp = await shopApi.getProducts();
    catalog.saveProducts(resp.items);
  } catch (e) {
    console.error('Не удалось загрузить товары', e);
  }
})();
