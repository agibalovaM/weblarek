import './scss/styles.scss';

import { Catalog } from './components/base/Models/Catalog';
import { Cart } from './components/base/Models/Cart';
import { BuyerData } from './components/base/Models/BuyerData';
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
console.log('Валидация данных покупателя:', buyer.validate());

// Очищаем данные покупателя
buyer.clear();
console.log('Данные покупателя после очистки:', buyer.getData());

// создаём экземпляр базового Api
const api = new Api(import.meta.env.VITE_API_ORIGIN, {
  headers: {
    'Content-Type': 'application/json'
  }
});

// создаём экземпляр ShopAPI
const shopApi = new ShopAPI(api);

// получаем товары с сервера
shopApi.getProducts()
  .then((response) => {
    // сохраняем товары в модель
    catalog.saveProducts(response.items);

    // выводим в консоль
    console.log('Каталог товаров из API:', catalog.getProducts());
  })
  .catch((error) => {
    console.error('Ошибка при получении товаров:', error);
  });

