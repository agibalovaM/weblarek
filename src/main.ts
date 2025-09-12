import './scss/styles.scss';

import { Catalog } from './components/Models/Catalog';
import { Cart } from './components/Models/Cart';
import { BuyerData } from './components/Models/BuyerData';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ShopAPI } from './components/base/ShopAPI';

//Проверка Catalog
const catalog = new Catalog();

// Сохраняем товары из тестового объекта
catalog.saveProducts(apiProducts.items);

// Получаем список товаров
console.log('Массив товаров из каталога:', catalog.getProducts());

// Выбираем первый товар
catalog.saveSelectedProduct(apiProducts.items[0]);
console.log('Выбранный товар:', catalog.getSelectedProduct());

// Поиск товара по id
const foundProduct = catalog.getProductById(apiProducts.items[0].id);
console.log('Найденный товар по id:', foundProduct);

// Проверка Cart
const cart = new Cart();

// Добавляем два товара
cart.addProduct(apiProducts.items[0]);
cart.addProduct(apiProducts.items[1]);
console.log('Товары в корзине:', cart.getProducts());

// Количество товаров
console.log('Количество товаров в корзине:', cart.getProductCount());

// Общая сумма
console.log('Сумма стоимости товаров:', cart.getTotalPrice());

// Проверка наличия товара
console.log('Есть ли товар с id=1 в корзине:', cart.hasProduct(apiProducts.items[0].id));

// Удаляем товар
cart.removeProduct(apiProducts.items[0].id);
console.log('Корзина после удаления одного товара:', cart.getProducts());

// Очищаем корзину
cart.clear();
console.log('Корзина после очистки:', cart.getProducts());

//Проверка BuyerData
const buyer = new BuyerData({
  payment: 'card',
  address: 'ул. Пушкина, д. 1',
  email: 'test@example.com',
  phone: '+79991234567',
});

// Получаем данные покупателя
console.log('Данные покупателя:', buyer.getData());

// Валидируем данные
console.log('Валидация данных покупателя (поля):', buyer.validateFields());
console.log('Валидация данных покупателя:', buyer.validate());

// Полная замена данных покупателя
buyer.saveData({
  payment: 'card',
  address: 'ул. Лермонтова, д. 5',
  email: 'save@example.com',
  phone: '+79990001122',
});
console.log('После полной замены данных (saveData):', buyer.getData());

// Обновление данных покупателя по одному полю
buyer.updateField('email', 'newmail@example.com');
console.log('После изменения email:', buyer.getData());

buyer.updateField('payment', 'cash');
console.log('После изменения payment:', buyer.getData());

// Очищаем данные покупателя
buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getData());

// создаём экземпляр базового Api
const api = new Api(import.meta.env.VITE_API_ORIGIN, {
  headers: {
    'Content-Type': 'application/json'
  }
});

// Проверка ShopAPI
const shopApi = new ShopAPI(api);

// Получаем список товаров
shopApi.getProducts()
  .then((response) => {
    console.log('Количество товаров в магазине:', response.total);
    console.log('Товары:', response.items);

    // Пробуем создать заказ на основе товаров
    const order = {
      payment: 'card' as const,
      email: 'order@example.com',
      phone: '+79998887766',
      address: 'ул. Чехова, д. 12',
      total: response.items[0].price ?? 0,
      items: [response.items[0].id],
    };

    return shopApi.createOrder(order);
  })
  .then((orderResponse) => {
    console.log('Ответ от сервера при создании заказа:', orderResponse);
  })
  .catch((error) => {
    console.error('Ошибка работы с ShopAPI:', error);
  });


