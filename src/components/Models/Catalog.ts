import { IProduct } from '../../types';
import { EventEmitter } from '../EventEmitter';

export class Catalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

     // новое: публичный эмиттер событий модели
  readonly events = new EventEmitter();

    getProducts(): IProduct[] {
        return this.products;
    }

    saveProducts(products: IProduct[]): void {
        this.products = products;
        // новое: сообщаем презентеру, что каталог изменился
    this.events.emit<IProduct[]>('catalog:changed', this.products);
    }

    saveSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
         // новое: сообщаем о выборе товара
    this.events.emit<IProduct | null>('catalog:selected', this.selectedProduct);
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }
}

