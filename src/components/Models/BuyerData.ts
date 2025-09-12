import { IBuyer, TPayment, ValidationMap } from '../../types';

export class BuyerData implements IBuyer {
    payment: TPayment = '';
    address: string = '';
    email: string = '';
    phone: string = '';

    constructor(data: IBuyer) {
        this.saveData(data);
    }

    //Проверка каждого поля отдельно
    validateFields(): ValidationMap {
        return {
          payment: this.payment === 'card' || this.payment === 'cash',
          address: this.address.trim().length > 0,
          email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim()),
          phone: /^\+?[0-9]{7,15}$/.test(this.phone.trim()),
        };
      }
    
    //Общая проверка
    validate(): boolean {
        const results = this.validateFields();
        return Object.values(results).every(Boolean);
      }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    //Полная замена данных
    saveData(newData: IBuyer): void {
        this.payment = newData.payment;
        this.address = newData.address;
        this.email = newData.email;
        this.phone = newData.phone;
    }

    //Обновление одного конкретного поля
    updateField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        (this as IBuyer)[field] = value;
  }

    clear(): void {
        this.payment = '';
        this.address = '';

        this.email = '';
        this.phone = '';
    }
}
