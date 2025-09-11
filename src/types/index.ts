// Типы данных приложения

// Тип для способа оплаты, выбираемый пользователем
export type TPayment = 'card' | 'cash' | ''; // '' — ещё не выбран

// Интерфейс для товара
export interface IProduct {
    id: string;           // уникальный идентификатор товара
    title: string;        // название товара
    image: string;        // ссылка на изображение
    category: string;     // категория товара
    price: number | null; // цена товара (может отсутствовать)
    description: string;  // описание товара
  }

// Интерфейс для покупателя
export interface IBuyer {
    payment: TPayment;
    address: string;        // адрес доставки
    email: string;          // электронная почта
    phone: string;          // номер телефона
  }

  // Типы для работы с API
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
  
//Слой коммуникации

// Список товаров
export interface IProductListResponse {
    total: number;
    items: IProduct[];
  }
  
  // Запрос на создание заказа
  export interface IOrderRequest {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
  }
  
  // Ответ от сервера
  export interface IOrderResponse {
    id: string;
    total: number;
  }
  