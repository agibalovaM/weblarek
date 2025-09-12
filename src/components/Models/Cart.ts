import { IProduct } from '../../types';

export class Cart {
    private items: IProduct[] = [];

    addProduct(product: IProduct): void {
        this.items.push(product);
    }

    removeProduct(productId: string): void {
        this.items = this.items.filter((item) => item.id !== productId);
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

    clear(): void {
        this.items = [];
    }
}
