import { IApi, IProductListResponse, IOrderRequest, IOrderResponse } from '../../types';

export class ShopAPI {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Получить список товаров
  getProducts(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>('/product/');
  }

  // Создать заказ
  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', order, 'POST');
  }
}
