import { IBuyer, TPayment } from '../../../types';

export class BuyerData implements IBuyer {
    payment: TPayment = '';
    address: string = '';
    email: string = '';
    phone: string = '';

    constructor(data: IBuyer) {
        this.saveData(data);
    }

    validate(): boolean {
        return Boolean(this.address && this.email && this.phone);
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    saveData(newData: IBuyer): void {
        this.payment = newData.payment;
        this.address = newData.address;
        this.email = newData.email;
        this.phone = newData.phone;
    }

    clear(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
    }
}
