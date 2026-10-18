/**
 * Shop constants — the few values the storefront needs in one place.
 * Frontend only: orders are placed over WhatsApp (the usual flow for a made-to-order atelier),
 * so there is no payment backend to configure.
 */

export const shopConfig = {
  /** Brand WhatsApp number in international format, digits only (no +). */
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "919999999999",

  /** Storefront currency. */
  currency: "INR",
  locale: "en-IN",

  /** Shown on the product page and in the bag. */
  madeToOrderNote: "Made to order · dispatched in 2–3 weeks",
  shippingNote: "Shipping across India · calculated when we confirm your order",
} as const;

/** wa.me deep link pre-filled with the given message. */
export const whatsappLink = (message: string) =>
  `https://wa.me/${shopConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
