export const COOKIE_PRICE = 10

export const COOKIES = [
  { id: 'snowman', name: 'Snowman', price: COOKIE_PRICE },
  { id: 'gingerbread', name: 'Gingerbread Man', price: COOKIE_PRICE },
  { id: 'mittens', name: 'Mittens', price: COOKIE_PRICE }
] as const

export type CookieId = typeof COOKIES[number]['id']

export const DELIVERY_THRESHOLD = 100
