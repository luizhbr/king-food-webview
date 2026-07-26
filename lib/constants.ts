export const APP_NAME = "King Food";
export const APP_SHORT_NAME = "King Food";
export const APP_DEFAULT_TITLE = "King Food | Açaí Delivery em Columbus, OH";
export const APP_TITLE_TEMPLATE = "%s | King Food";
export const APP_DESCRIPTION =
  "King Food - O melhor açaí de Columbus, OH. Peça online com entrega rápida via OlaClick.";

export const CONTACT_INFO = {
  phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "12673107535",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "12673107535",
  email: "contato@kingfood.online",
  address: "Columbus, Ohio, EUA",
  website: "https://kingfood.online",
};

export const HOURS = [
  { day: "Segunda", hours: "11:00 - 21:00" },
  { day: "Terça", hours: "11:00 - 21:00" },
  { day: "Quarta", hours: "11:00 - 21:00" },
  { day: "Quinta", hours: "11:00 - 21:00" },
  { day: "Sexta", hours: "11:00 - 22:00" },
  { day: "Sábado", hours: "11:00 - 22:00" },
  { day: "Domingo", hours: "12:00 - 20:00" },
];

export const OLACLICK_URL =
  process.env.NEXT_PUBLIC_OLACLICK_URL || "https://kingfood.fe-v2.ola.click/products";
