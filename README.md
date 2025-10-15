# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейс IProduct 
Представляет товар в магазине с его основными характеристиками

interface IProduct {
  id: string;          // уникальный идентификатор товара
  title: string;        // название товара
  image: string;        // ссылка на изображение
  category: string;     // категория товара
  price: number | null; // цена товара (может отсутствовать)
  description: string;  // описание товара
}

#### Интерфейс IBuyer
Содержит контактные данные и выбранный способ оплаты. Используется при оформлении заказа

type TPayment = 'card' | 'cash' | ''; // '' — ещё не выбран

interface IBuyer {
  payment: TPayment;
  address: string;              // адрес доставки
  email: string;                // электронная почта
  phone: string;                // номер телефона
}

### Модели данных

#### Класс Catalog 
Управляет отображением списка товаров и выбором конкретного товара в каталоге. Отвечает за хранение массива всех товаров и текущего выбранного товара

Конструктор: не принимает параметров

Поля класса: 
`private products: IProduct[]`       // массив всех товаров в каталоге
`private selectedProduct: IProduct | null` // выбранный пользователем товар. Если товар ещё не выбран, хранит null

Методы класса: 
`getProducts(): IProduct[]` — возвращает массив товаров, сохранённых в каталоге
`saveProducts(products: IProduct[]): void` — принимает массив товаров products и сохраняет его в поле products
`saveSelectedProduct(product: IProduct): void` — принимает объект товара product и сохраняет его в качестве выбранного товара
`getSelectedProduct(): IProduct | null` — возвращает выбранный товар или null, если выбор ещё не сделан
`getProductById(id: string): IProduct | undefined`- принимает идентификатор товара id и возвращает найденный товар или undefined, если такого товара не

#### Класс Cart
Сохраняет товары, которые пользователь выбрал для покупки, и предоставляет методы для управления ими

Конструктор: не принимает параметров

Поля класса: 
`private items: IProduct[]` // массив товаров, добавленных в корзину

Методы класса:
`addProduct(product: IProduct): void` — принимает объект товара product и добавляет его в корзину
`removeProduct(productId: string): void` — принимает идентификатор товара productId и удаляет соответствующий товар из корзины
`getProductCount(): number` — возвращает количество товаров, находящихся в корзине
`getProducts(): IProduct[]` — возвращает массив товаров, находящихся в корзине
`getTotalPrice(): number` — возвращает суммарную стоимость всех товаров в корзине
`hasProduct(productId: string): boolean` — принимает идентификатор товара productId и возвращает true, если товар есть в корзине, и false, если его нет
`clear(): void` - очищает корзину, удаляя все товары

#### Класс BuyerData 
Хранит и управляет данными покупателя, необходимыми для оформления заказа: контактной информацией и способом оплаты. Также выполняет валидацию введённых данных

Конструктор: constructor(data: IBuyer)
Принимает объект data типа IBuyer и сохраняет значения его полей в соответствующие поля класса

Поля класса: полностью соотвествуют интерфейсу
`payment: TPayment`  // способ оплаты: 'card' — картой, 'cash' — наличными, '' — ещё не выбран
`address: string`              // адрес доставки
`email: string`                // электронная почта
`phone: string`                // номер телефона

Методы класса:
`validateFields(): Record<keyof IBuyer, boolean>` — проверка корректности каждого поля отдельно.Возвращает объект вида `{ payment: true|false, address: true|false, email: true|false, phone: true|false }`. Используется для отображения ошибок в форме.

`validate(): boolean` — проверка корректности всех данных целиком. Возвращает `true`, если все поля валидны, и `false`, если хотя бы одно невалидно

`getData(): IBuyer` — получить текущие данные покупателя в виде объекта типа IBuyer

`saveData(newData: IBuyer): void` — принимает объект newData типа IBuyer и сохраняет его значения в соответствующих полях класса

`updateField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void`- обновляет одно конкретное поле покупателя

`clear(): void` - очищает данные покупателя (сбрасывает все поля в пустые значения)

### «Слой коммуникации»

#### Класс ShopAPI
Отвечает за взаимодействие приложения с сервером «Веб-ларёк». Использует класс Api для выполнения HTTP-запросов

Конструктор:constructor(api: IApi)
Принимает объект, реализующий интерфейс IApi 

Методы класса:
`getProducts(): Promise<IProductListResponse>` Выполняет GET запрос к эндпоинту /product/. Возвращает объект с общим количеством товаров и массивом товаров
`createOrder(order: IOrder): Promise<IOrderResponse>` Выполняет POST запрос к эндпоинту /order/. Отправляет объект заказа (IOrder) и получает от сервера ответ (IOrderResponse)

### «Слой Представления»

#### Header (наследник класса Component)
Этот класс полностью отвечает за работу хедера и отображение количества товаров в корзине

Данные (HeaderData):
counter: number — число товаров в корзине

Поля класса:
`basketButton: HTMLButtonElement` — кнопка корзины
`counterElement: HTMLElement` — элемент-счётчик

Методы класса:
`set counter(value: number)` — обновляет число в счётчике
`onBasketClick(handler: () => void)` — навешивает обработчик на basketButton

#### Gallery (наследник класса Component)
Этот класс управляет списком карточек товаров на главной странице

Данные (GalleryData):
catalog: HTMLElement[] — список карточек товаров

Поля класса:
`catalogElement: HTMLElement` — контейнер для каталога 

Методы класса:
`set catalog(items: HTMLElement[])` — принимает массив карточек и вставляет их в DOM

#### Модальное окно Modal (самостоятельный класс, не наследуется)
Контейнер для показа любого контента (карточка, корзина, формы, успех)

Данные (ModalData):
content: HTMLElement — узел, который нужно отобразить внутри модалки

Поля класса:
`modalElement: HTMLElement` — корневой элемент модального окна
`containerElement: HTMLElement` — «коробка» с контентом (чтобы отличить клик по самому контейнеру)
`contentElement: HTMLElement` — блок в который динамически вставляется контент модалки
`closeButton: HTMLButtonElement` — хранит кнопку "крестик"

Методы класса:
`set content(value: HTMLElement)` — заменяет содержимое .modal__content
`open()` — добавляет modal_active, настраивает aria и блокирует скролл
`close()` — убирает modal_active, очищает контент и снимает блокировку скролла
`bindCloseHandlers()` — крестик и клик вне контейнера

#### Подтверждение Success (наследник класса Component) — template #success
Окно успешного оформления заказа

Данные (SuccessData):
amount: number — списанная сумма

Поля класса:
`descriptionElement: HTMLElement` — хранит кол-во списанных синапсов
`closeButton: HTMLButtonElement` — хранит кнопку

Методы класса:
`set amount(value: number)` — подставляет сумму в текст
`onClose(handler: () => void)` — клик по closeButton

#### CardBase (наследник класса Component) — родитель карточек
Общий функционал для всех карточек

Данные (CardBaseData):
id: string
title: string
price: number | null
category?: string
image?: string

Поля класса (общие селекторы, если есть):
`titleElement?: HTMLElement` — заголовок
`priceElement?: HTMLElement` — цена
`categoryElement?: HTMLElement` — категория
`imageElement?: HTMLImageElement` — картинка

Методы класса:
`set title(value: string)` — ставит заголовок
`set price(value: number | null)` — цена либо «Бесценно»
`set category(value?: string)` — текст и модификатор берутся из categoryMap (src/utils/constants.ts): title для текста, mod для класса card__category_* (с фолбэком на значение категории)
`set image(value?: { src?: string; alt?: string })` — меняет изображение
`onClick(handler: () => void)` — общий клик по карточке/кнопке-обёртке

#### CatalogCard (наследник CardBase) — template #card-catalog
Карточка в каталоге

Доп. поля:
`root: HTMLButtonElement` — кнопка

Методы:
наследует базовые

#### PreviewCard (наследник CardBase) — template #card-preview
Карточка в модальном окне (детальный просмотр)

Доп. данные:
description: string
inCart: boolean

Доп. поля:
`textElement: HTMLElement` — описание
`actionButton: HTMLButtonElement` — кнопка "купить"

Доп. методы:
`set description(value: string)`-добавляет описание
`set inCart(value: boolean)` — «Купить» / «Удалить из корзины»
`set available(value: boolean)` — включает или выключает доступность покупки:
если value = false, делает кнопку неактивной (disabled = true) и меняет текст на «Недоступно»
`onAction(handler: () => void)` — клик по кнопке действия

#### BasketItem (наследник CardBase) — template #card-basket
Карточка товара внутри корзины

Доп. данные:
index: number

Доп. поля:
`indexElement: HTMLElement` — номер товара в корзине
`deleteButton: HTMLButtonElement` — кнопка "удалить"

Доп. методы:
`set index(value: number)`- устанавливает порядковый номер товара в корзине
`onDelete(handler: () => void)`- навешивает обработчик удаления товара

#### Basket (наследник класса Component) — template #basket
Отображает список позиций в корзине, итоговую сумму и кнопку «Оформить»

Данные (BasketData):
items: HTMLElement[] — элементы BasketItem
total: number — сумма
empty: boolean — корзина пуста или нет

Поля класса:
`listElement: HTMLUListElement` — список в корзине 
`totalElement: HTMLElement` — общая сумма
`checkoutButton: HTMLButtonElement` — оформить

Методы класса:
`set items(value: HTMLElement[])` — вставляет список
`set total(value: number)` — обновляет сумму
`set empty(value: boolean)` — «Корзина пуста» + disabled для кнопки
`onCheckout(handler: () => void)` — клик «Оформить»

#### FormBase<T> (наследник класса Component) — родитель форм
Общий функционал: ошибки, активация кнопки, сабмит

Данные (FormBaseData):
errors: string | null
canSubmit: boolean

Поля класса:
`formElement: HTMLFormElement` — хранит HTML-элемент формы 
`submitButton: HTMLButtonElement` — хранит кнопку отправки формы
`errorsElement: HTMLElement` — хранит элемент, где отображается текст ошибки

Методы класса:
`set errors(value: string | null)` — показать/скрыть сообщение
`set canSubmit(value: boolean)` — disabled на кнопке
`onSubmit(handler: () => void)` — сабмит формы

#### OrderForm (наследник FormBase) — template #order
выбор оплаты и адрес

Доп. данные:
payment: 'card' | 'cash' | ''
address: string

Доп. поля:
`cardButton: HTMLButtonElement` — хранит кнопку выбора способа оплаты «Онлайн»
`cashButton: HTMLButtonElement` — хранит кнопку выбора способа оплаты «При получении»
`addressInput: HTMLInputElement` — хранит поле ввода адреса доставки
`nextButton: HTMLButtonElement` — хранит кнопку «Далее» для перехода ко второму шагу оформления

Доп. методы:
`set payment(value: 'card' | 'cash' | '')` — выделяет выбранную кнопку
`set address(value: string)` — заполняет поле
`onSelectPayment(handler: (v: 'card' | 'cash') => void)`- клик по способу оплаты
`onInputAddress(handler: (v: string) => void)`- ввод адреса

#### ContactsForm (наследник FormBase) — template #contacts
ввод почты и телефона

Доп. данные:
email: string
phone: string

Доп. поля:
`emailInput: HTMLInputElement` — хранит элемент поля ввода email
`phoneInput: HTMLInputElement` — хранит элемент поля ввода телефона

Доп. методы:
`set email(value: string)`- вставляет переданное значение в поле ввода email
`set phone(value: string)`- вставляет переданное значение в поле ввода телефона
`onInputEmail(handler: (v: string) => void)`- навешивает обработчик на событие input поля email;
при каждом изменении вызывает handler и передаёт новое значение
`onInputPhone(handler: (v: string) => void)`- при вводе пользователем номера вызывает переданный обработчик с текущим значением

#### События, генерируемые «Слой Представления»:
`basket:open` — Header, клик по иконке корзины. (payload: нет)
`card:select` — CatalogCard, клик по карточке в каталоге. (payload: { id: string })
`modal:open / modal:close` — Modal, при открытии/закрытии. (payload: нет)
`success:close` — Success, клик по кнопке «За новыми покупками!». (payload: нет)
`order:start` — Basket, клик «Оформить». (payload: нет)
`basket:item-remove` — BasketItem, клик по «удалить». (payload: { id: string })
`card:add / card:remove` — PreviewCard, клик по кнопке действия. (payload: { id: string })
`order:payment-select` — OrderForm, выбор 'card' | 'cash'. (payload: { payment: 'card' | 'cash' })
`order:address-input` — OrderForm, ввод адреса. (payload: { address: string })
`order:submit` — OrderForm, сабмит шага 1. (payload: нет)
`contacts:email-input` — ContactsForm, ввод email. (payload: { email: string })
`contacts:phone-input` — ContactsForm, ввод телефона. (payload: { phone: string })
`contacts:submit` — ContactsForm, сабмит шага 2. (payload: нет)




