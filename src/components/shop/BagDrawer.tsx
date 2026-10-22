"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { cartCount, cartSubtotal, useShopStore } from "@/store/shop-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice, shopConfig, whatsappLink } from "@/config/shop";

/**
 * The bag — a torn slip of parchment that slides in from the right.
 *
 * There is no checkout backend by design: the order is placed over WhatsApp, so the visitor
 * leaves with a written, personal confirmation instead of a silent payment form.
 */
export function BagDrawer() {
  const mounted = useMounted();
  const cartOpen = useShopStore((s) => s.cartOpen);
  const setCartOpen = useShopStore((s) => s.setCartOpen);
  const cart = useShopStore((s) => s.cart);
  const setQty = useShopStore((s) => s.setQty);
  const removeFromCart = useShopStore((s) => s.removeFromCart);

  const items = mounted ? cart : [];
  const subtotal = formatPrice(cartSubtotal(items));

  // Escape closes the bag; the page behind it stays put while it is open.
  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [cartOpen, setCartOpen]);

  const orderOnWhatsApp = () => {
    const lines = items.map(
      (c) => `• ${c.name} — Size ${c.size} × ${c.qty} — ${formatPrice(c.price * c.qty)}`
    );
    const message = [
      "Hello Maison D'Vine, I would like to order:",
      "",
      ...lines,
      "",
      `Subtotal: ${subtotal}`,
      "",
      "Please share the payment and delivery details.",
    ].join("\n");
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div
      aria-hidden={!cartOpen}
      className={`fixed inset-0 z-[120] ${cartOpen ? "" : "pointer-events-none"}`}
    >
      {/* backdrop */}
      <button
        type="button"
        tabIndex={cartOpen ? 0 : -1}
        aria-label="Close the bag"
        onClick={() => setCartOpen(false)}
        className={`absolute inset-0 cursor-default bg-[#0e0d0c]/70 backdrop-blur-[2px] transition-opacity duration-500 ${
          cartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* the slip */}
      <aside
        role="dialog"
        aria-label="Your bag"
        className={`absolute top-0 right-0 flex h-full w-full max-w-[430px] flex-col shadow-[-18px_0_40px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "radial-gradient(120% 90% at 100% 0%, #fbf5e9 0%, #f3ead9 55%, #ebdfc9 100%)",
        }}
      >
        <header className="flex items-center justify-between border-b border-[#7c6a52]/25 px-6 py-5">
          <div>
            <p className="font-serif text-[20px] text-[#1c1815]">Your Bag</p>
            <p className="mt-0.5 text-[10px] tracking-[0.28em] text-[#8a6a3b] uppercase">
              {cartCount(items)} {cartCount(items) === 1 ? "piece" : "pieces"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close the bag"
            className="cursor-pointer p-2 text-[#5b4a35] transition-colors hover:text-[#1c1815]"
          >
            <X className="h-5 w-5 stroke-[1.4]" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="font-allura text-[30px] leading-tight text-[#8a6a3b]">
              Your bag is still waiting.
            </p>
            <Link
              href="/dresses"
              onClick={() => setCartOpen(false)}
              className="border border-[#1c1815]/60 px-6 py-3 text-[10px] tracking-[0.28em] text-[#1c1815] uppercase transition-colors hover:bg-[#1c1815] hover:text-[#f3ead9]"
            >
              See the dresses
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-5">
              {items.map((c) => (
                <li
                  key={`${c.id}-${c.size}`}
                  className="flex gap-4 border-b border-[#7c6a52]/20 py-5 last:border-b-0"
                >
                  <Link
                    href={`/dresses/${c.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="relative h-[104px] w-[78px] shrink-0 overflow-hidden border border-[#7c6a52]/30 bg-[#e9dcc6]"
                  >
                    <Image src={c.image} alt={c.name} fill sizes="78px" className="object-cover" />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-serif text-[17px] text-[#1c1815]">{c.name}</p>
                        <p className="mt-0.5 text-[10px] tracking-[0.22em] text-[#8a6a3b] uppercase">
                          Size {c.size}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(c.id, c.size)}
                        aria-label={`Remove ${c.name}`}
                        className="cursor-pointer p-1 text-[#8a7a63] transition-colors hover:text-[#8c3b2e]"
                      >
                        <X className="h-3.5 w-3.5 stroke-[1.6]" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-[#7c6a52]/35">
                        <button
                          type="button"
                          onClick={() => setQty(c.id, c.size, c.qty - 1)}
                          aria-label="Decrease quantity"
                          className="cursor-pointer px-2.5 py-1.5 text-[#5b4a35] transition-colors hover:text-[#1c1815]"
                        >
                          <Minus className="h-3 w-3 stroke-[1.6]" />
                        </button>
                        <span className="min-w-6 text-center text-[13px] text-[#1c1815]">
                          {c.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(c.id, c.size, c.qty + 1)}
                          aria-label="Increase quantity"
                          className="cursor-pointer px-2.5 py-1.5 text-[#5b4a35] transition-colors hover:text-[#1c1815]"
                        >
                          <Plus className="h-3 w-3 stroke-[1.6]" />
                        </button>
                      </div>
                      <span className="text-[13px] text-[#1c1815]">
                        {formatPrice(c.price * c.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-[#7c6a52]/25 px-6 pt-5 pb-7">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] tracking-[0.28em] text-[#5b4a35] uppercase">
                  Subtotal
                </span>
                <span className="font-serif text-[22px] text-[#1c1815]">{subtotal}</span>
              </div>
              <p className="mt-2 text-[11px] leading-5 text-[#5b4a35]/75">
                {shopConfig.shippingNote}
              </p>

              <button
                type="button"
                onClick={orderOnWhatsApp}
                className="mt-5 w-full cursor-pointer bg-[#1c1815] py-4 text-[11px] tracking-[0.28em] text-[#f3ead9] uppercase transition-colors duration-300 hover:bg-[#33291f]"
              >
                Place the order on WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="mt-3 w-full cursor-pointer py-2 text-[10px] tracking-[0.28em] text-[#5b4a35] uppercase transition-colors hover:text-[#1c1815]"
              >
                Keep browsing
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
