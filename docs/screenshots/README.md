# Screenshots

Place README screenshots in this folder. Use the **exact file names** below so the
links in the root [`README.md`](../../README.md) render correctly.

Recommended capture settings:

- Browser at **1440×900** (or 1280×800), light theme, window maximized.
- Capture the **viewport only** (no browser chrome / bookmarks bar).
- Format **PNG**; keep each file under ~500 KB (compress if needed).
- Make sure the page shows **real seeded data** (run `bun run --filter=api seed` first),
  not empty states.

## Required (linked in README)

| File name       | Page / route                  | What to show |
| --------------- | ----------------------------- | ------------ |
| `catalog.png`   | `/catalog`                    | Product grid with categories & filters, several products visible |
| `product.png`   | `/products/[id]`              | A single product detail page (image, price, stock, "add to cart") |
| `cart.png`      | `/cart`                       | Cart with 2–3 items and the live total / promo code field |
| `checkout.png`  | `/checkout`                   | Checkout form filled in, order summary visible |

## Optional (nice for the demo / User Guide)

| File name       | Page / route                  | What to show |
| --------------- | ----------------------------- | ------------ |
| `login.png`     | `/login`                      | Login form (use `user@gmail.com` / `PASSWORD1`) |
| `admin.png`     | `/admin/products`             | Admin product management table (log in as `admin@gmail.com`) |
| `orders.png`    | `/profile/orders`             | Order history after placing an order |

> Tip: for a short animated GIF of a full flow (browse → add to cart → checkout),
> name it `demo.gif` and drop it here — you can reference it from the README too.
