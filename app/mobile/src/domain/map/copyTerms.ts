export const APPROVED_RUSSIAN_MAP_TERMS = [
  'план на день',
  'линия плана на день',
  'линия порядка',
  'скачанная карта',
  'просмотр скачанной карты',
  'сохраненные места доступны',
  'сохраненные данные доступны',
  'поиск доступен онлайн',
  'онлайн-поиск недоступен офлайн',
  'за пределами карты Грузии',
  'место за пределами Грузии',
  'за пределами скачанной области',
  'место за пределами скачанной области',
  'открыть во внешней карте',
] as const;

export const PROHIBITED_RUSSIAN_MAP_TERMS = [
  'офлайн-поиск',
  'офлайн-геокодинг',
  'офлайн-маршрут',
  'навигация',
  'оптимальный маршрут',
  'пробки',
  'ETA',
  'перестроение маршрута',
  'работает везде',
  'Яндекс Карты всегда откроются',
] as const;

export function isApprovedMapCopyTerm(term: string): boolean {
  return (APPROVED_RUSSIAN_MAP_TERMS as readonly string[]).includes(term);
}

export function isProhibitedMapCopyTerm(term: string): boolean {
  return (PROHIBITED_RUSSIAN_MAP_TERMS as readonly string[]).includes(term);
}
