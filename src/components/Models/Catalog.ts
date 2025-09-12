import { IProduct } from '../../types';

export class Catalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    getProducts(): IProduct[] {
        return this.products;
    }

    saveProducts(products: IProduct[]): void {
        this.products = products;
    }

    saveSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }
}

