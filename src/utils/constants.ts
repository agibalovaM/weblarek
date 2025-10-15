/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 
/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

// Модификаторы фона категорий карточек
export const categoryMap: Record<string, { title: string; mod: string }> = {
  'софт-скил':{title: 'софт-скил', mod: 'soft'},
  'другое':{title: 'другое', mod: 'other'},
  'хард-скил':{title: 'хард-скил', mod: 'hard'},
  'дополнительное':{title: 'дополнительное', mod: 'additional'}, 
  'кнопка':{title: 'кнопка', mod: 'button'},      
  // fallback будет применён в CardBase, если ключ не найден
};

export const MODAL_ACTIVE_CLASS = 'modal_active';

