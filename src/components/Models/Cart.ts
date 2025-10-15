import { IProduct } from '../../types';
import { EventEmitter } from '../EventEmitter';

export type CartSnapshot = {
    items: IProduct[];
    count: number;
    total: number;
  };

export class Cart {
    private items: IProduct[] = [];

    // новое: публичный эмиттер
  readonly events = new EventEmitter();

    addProduct(product: IProduct): void {
        this.items.push(product);
        this.emitChanged();
    }

    removeProduct(productId: string): void {
        this.items = this.items.filter((item) => item.id !== productId);
        this.emitChanged();
    }

    getProductCount(): number {
        return this.items.length;
    }

    getProducts(): IProduct[] {
        return this.items;
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    hasProduct(productId: string): boolean {
        return this.items.some((item) => item.id === productId);
    }

    // внутреннее: шлём единое событие после любых мутаций
  private emitChanged() {
    const snap: CartSnapshot = {
      items: this.getProducts(),
      count: this.getProductCount(),
      total: this.getTotalPrice(),
    };
    this.events.emit<CartSnapshot>('cart:changed', snap);
  }

    clear(): void {
        this.items = [];
        this.emitChanged();
    }
}
