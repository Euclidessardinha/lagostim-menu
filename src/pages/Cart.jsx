import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
} from "../utils/cart";

import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const formatPrice = (price) => {
    return `${price.toLocaleString("pt-MZ")} MT`;
  };

  const handleIncrease = (item) => {
    const updatedCart = updateCartItemQuantity(
      item.id,
      item.quantity + 1
    );

    setCart(updatedCart);
  };

  const handleDecrease = (item) => {
    const updatedCart = updateCartItemQuantity(
      item.id,
      item.quantity - 1
    );

    setCart(updatedCart);
  };

  const handleRemove = (itemId) => {
    const updatedCart = removeFromCart(itemId);

    setCart(updatedCart);
  };

  const handleClearCart = () => {
    clearCart();

    setCart([]);
  };

  const total = getCartTotal();

  const itemCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleWhatsApp = () => {
  if (!cart.length) return;

  const orderLines = cart
    .map(
      (item) =>
        `${item.quantity}x ${item.name} — ${formatPrice(
          item.price * item.quantity
        )}`
    )
    .join("\n");

  const message = encodeURIComponent(
    `🍽️ PEDIDO — LAGOSTIM DE MZ

Olá! Gostaria de fazer o seguinte pedido:

${orderLines}

━━━━━━━━━━━━━━
TOTAL: ${formatPrice(total)}
━━━━━━━━━━━━━━

Gostaria de confirmar este pedido.

Obrigado!`
  );

  window.open(
    `https://wa.me/258871538162?text=${message}`,
    "_blank"
  );
};

  return (
    <div className="cart-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="cart-header">

        <a
          href="/"
          className="cart-brand"
        >
          <img
            src="/logo-lagostim.png"
            alt="Lagostim de MZ"
          />

          <div>
            <strong>
              Lagostim de MZ
            </strong>

            <span>
              Menu Digital
            </span>
          </div>
        </a>

        <a
          href="/menu"
          className="cart-back-menu"
        >
          ← Continuar a ver o menu
        </a>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="cart-main">

        <div className="cart-container">

          {/* TITLE */}

          <div className="cart-title">

            <span>
              O seu pedido
            </span>

            <h1>
              Meu Carrinho
            </h1>

            {cart.length > 0 && (
              <p>
                {itemCount}{" "}
                {itemCount === 1
                  ? "item"
                  : "itens"}{" "}
                selecionado
                {itemCount === 1
                  ? ""
                  : "s"}
              </p>
            )}

          </div>


          {/* =========================
              EMPTY
          ========================= */}

          {cart.length === 0 ? (

            <div className="cart-empty">

              <div className="cart-empty-icon">
                🛒
              </div>

              <h2>
                O seu carrinho está vazio
              </h2>

              <p>
                Explore o nosso menu e escolha
                os seus pratos favoritos.
              </p>

              <a
                href="/menu"
                className="cart-empty-button"
              >
                Ver o menu
              </a>

            </div>

          ) : (

            <div className="cart-layout">

              {/* =========================
                  ITEMS
              ========================= */}

              <section className="cart-items">

                {cart.map((item) => (

                  <article
                    key={item.id}
                    className="cart-item"
                  >

                    <div className="cart-item-image">

                      <img
                        src={item.image}
                        alt={item.name}
                      />

                    </div>


                    <div className="cart-item-info">

                      <h2>
                        {item.name}
                      </h2>

                      <span className="cart-item-price">
                        {formatPrice(item.price)}
                      </span>


                      <div className="cart-item-bottom">

                        <div className="cart-quantity">

                          <button
                            type="button"
                            onClick={() =>
                              handleDecrease(item)
                            }
                          >
                            −
                          </button>

                          <strong>
                            {item.quantity}
                          </strong>

                          <button
                            type="button"
                            onClick={() =>
                              handleIncrease(item)
                            }
                          >
                            +
                          </button>

                        </div>

                        <strong className="cart-item-total">
                          {formatPrice(
                            item.price *
                              item.quantity
                          )}
                        </strong>

                      </div>

                    </div>


                    <button
                      type="button"
                      className="cart-remove"
                      onClick={() =>
                        handleRemove(item.id)
                      }
                      aria-label={`Remover ${item.name}`}
                    >
                      ×
                    </button>

                  </article>

                ))}


                <button
                  type="button"
                  className="cart-clear"
                  onClick={handleClearCart}
                >
                  Limpar pedido
                </button>

              </section>


              {/* =========================
                  SUMMARY
              ========================= */}

              <aside className="cart-summary">

                <div className="cart-summary-header">

                  <span>
                    Resumo
                  </span>

                  <h2>
                    Seu pedido
                  </h2>

                </div>


                <div className="cart-summary-lines">

                  <div>
                    <span>
                      Subtotal
                    </span>

                    <strong>
                      {formatPrice(total)}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Taxa de entrega
                    </span>

                    <strong>
                      A combinar
                    </strong>
                  </div>

                </div>


                <div className="cart-summary-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    {formatPrice(total)}
                  </strong>

                </div>


                <button
                  type="button"
                  className="cart-whatsapp-button"
                  onClick={handleWhatsApp}
                >

                  <span>
                    ◉
                  </span>

                  <div>

                    <small>
                      FINALIZAR PEDIDO
                    </small>

                    <strong>
                      Pedir pelo WhatsApp
                    </strong>

                  </div>

                  <span>
                    →
                  </span>

                </button>


                <p className="cart-note">
                  O pedido será enviado pelo
                  WhatsApp do Lagostim de MZ.
                </p>

              </aside>

            </div>

          )}

        </div>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="cart-footer">

        <div>

          <strong>
            LAGOSTIM DE MZ
          </strong>

          <span>
            O sabor do mar à sua mesa.
          </span>

        </div>

        <a href="/menu">
          Ver menu completo →
        </a>

      </footer>

    </div>
  );
}

export default Cart;