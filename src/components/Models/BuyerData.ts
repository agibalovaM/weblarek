import { IBuyer, TPayment, ValidationMap } from '../../types';
import { EventEmitter } from '../EventEmitter';

// удобный тип полезной нагрузки события
export type BuyerChangedPayload = {
    data: IBuyer;
    fields: ValidationMap;
    valid: boolean;
  };

export class BuyerData implements IBuyer {
    payment: TPayment = '';
    address: string = '';
    email: string = '';
    phone: string = '';

    // новое: публичный эмиттер событий модели
  readonly events = new EventEmitter();

    constructor(data: IBuyer) {
        this.saveData(data); // это вызовет emit
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
        this.emitChanged();
    }

    //Обновление одного конкретного поля
    updateField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        (this as IBuyer)[field] = value;
        this.emitChanged();
  }

    clear(): void {
        this.payment = '';
        this.address = '';

        this.email = '';
        this.phone = '';
        this.emitChanged();
    }

    // внутреннее: единая точка эмита события
  private emitChanged() {
    const payload: BuyerChangedPayload = {
      data: this.getData(),
      fields: this.validateFields(),
      valid: this.validate(),
    };
    this.events.emit<BuyerChangedPayload>('buyer:changed', payload);
  }
}
