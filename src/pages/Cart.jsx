
import { useEffect, useState } from "react";

import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../utils/cart";

import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  // Formatar preços em Meticais
  const formatPrice = (price) => {
    return `${Number(price || 0).toLocaleString("pt-MZ")} MT`;
  };

  // Atualizar quantidade
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

  // Remover produto
  const handleRemove = (itemId) => {
    const updatedCart = removeFromCart(itemId);
    setCart(updatedCart);
  };

  // Limpar carrinho
  const handleClearCart = () => {
    clearCart();
    setCart([]);
  };

  // Valores calculados a partir do estado atual
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  // Finalizar pedido pelo WhatsApp
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

    const whatsappUrl = `https://wa.me/258871538162?text=${message}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="cart-page">

      {/* HEADER */}

      <header className="cart-header">

        <a href="/" className="cart-brand">
          <img
            src="/logo-lagostim.png"
            alt="Logótipo Lagostim de MZ"
          />

          <div>
            <strong>Lagostim de MZ</strong>
            <span>Menu Digital</span>
          </div>
        </a>

        <a href="/menu" className="cart-back-menu">
          <span aria-hidden="true">←</span>
          Continuar a ver o menu
        </a>

      </header>

      {/* MAIN */}

      <main className="cart-main">

        <div className="cart-container">

          {/* TITLE */}

          <div className="cart-title">

            <span className="cart-eyebrow">
              O seu pedido
            </span>

            <h1>Meu Carrinho</h1>

            {cart.length > 0 && (
              <p>
                {itemCount}{" "}
                {itemCount === 1 ? "item selecionado" : "itens selecionados"}
              </p>
            )}

          </div>

          {/* EMPTY CART */}

          {cart.length === 0 ? (

            <section className="cart-empty">

              <div className="cart-empty-icon">
                <span>🛒</span>
              </div>

              <span className="cart-empty-label">
                AINDA NÃO ESCOLHEU NADA?
              </span>

              <h2>O seu carrinho está vazio</h2>

              <p>
                Os melhores sabores estão à sua espera.
                Explore o nosso menu e escolha os seus pratos favoritos.
              </p>

              <a href="/menu" className="cart-empty-button">
                Explorar o menu
                <span aria-hidden="true">→</span>
              </a>

            </section>

          ) : (

            <div className="cart-layout">

              {/* CART ITEMS */}

              <section className="cart-items-section">

                <div className="cart-items-heading">
                  <div>
                    <span>SELEÇÃO</span>
                    <h2>Os seus pratos</h2>
                  </div>

                  <span className="cart-items-count">
                    {itemCount} {itemCount === 1 ? "item" : "itens"}
                  </span>
                </div>

                <div className="cart-items">

                  {cart.map((item) => (

                    <article
                      key={item.id}
                      className="cart-item"
                    >

                      <div className="cart-item-image">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                        />
                      </div>

                      <div className="cart-item-info">

                        <div className="cart-item-details">
                          <h2>{item.name}</h2>

                          <span className="cart-item-price">
                            {formatPrice(item.price)}{" "}
                            <span className="cart-price-unit">/ unidade</span>
                          </span>
                        </div>

                        <div className="cart-item-bottom">

                          <div
                            className="cart-quantity"
                            aria-label={`Quantidade de ${item.name}`}
                          >

                            <button
                              type="button"
                              onClick={() => handleDecrease(item)}
                              aria-label={`Diminuir quantidade de ${item.name}`}
                            >
                              −
                            </button>

                            <strong>{item.quantity}</strong>

                            <button
                              type="button"
                              onClick={() => handleIncrease(item)}
                              aria-label={`Aumentar quantidade de ${item.name}`}
                            >
                              +
                            </button>

                          </div>

                          <strong className="cart-item-total">
                            {formatPrice(item.price * item.quantity)}
                          </strong>

                        </div>

                      </div>

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remover ${item.name} do carrinho`}
                        title="Remover produto"
                      >
                        ×
                      </button>

                    </article>

                  ))}

                </div>

                <div className="cart-items-footer">

                  <a href="/menu" className="cart-continue-link">
                    <span aria-hidden="true">←</span>
                    Adicionar mais pratos
                  </a>

                  <button
                    type="button"
                    className="cart-clear"
                    onClick={handleClearCart}
                  >
                    Limpar pedido
                  </button>

                </div>

              </section>

              {/* ORDER SUMMARY */}

              <aside className="cart-summary">

                <div className="cart-summary-header">

                  <span>RESUMO DO PEDIDO</span>

                  <h2>Detalhes da compra</h2>

                  <p>
                    Confira o seu pedido antes de finalizar.
                  </p>

                </div>

                <div className="cart-summary-lines">

                  <div>
                    <span>
                      Produtos ({itemCount})
                    </span>

                    <strong>{formatPrice(total)}</strong>
                  </div>

                  <div>
                    <span>Taxa de entrega</span>
                    <strong className="cart-delivery-value">
                      A combinar
                    </strong>
                  </div>

                </div>

                <div className="cart-summary-total">

                  <div>
                    <span>Total dos produtos</span>
                    <small>Em Meticais (MT)</small>
                  </div>

                  <strong>{formatPrice(total)}</strong>

                </div>

                <button
                  type="button"
                  className="cart-whatsapp-button"
                  onClick={handleWhatsApp}
                  disabled={!cart.length}
                >

                  <span className="cart-whatsapp-icon">
                    ◉
                  </span>

                  <div>
                    <small>FINALIZAR PEDIDO</small>
                    <strong>Pedir pelo WhatsApp</strong>
                  </div>

                  <span className="cart-whatsapp-arrow">
                    →
                  </span>

                </button>

                <div className="cart-secure-note">
                  <span>✓</span>
                  <p>
                    O seu pedido será enviado diretamente
                    para o WhatsApp do Lagostim de MZ.
                  </p>
                </div>

                <div className="cart-summary-footer">
                  <span>🍽️</span>
                  <p>Obrigado por escolher o Lagostim de MZ!</p>
                </div>

              </aside>

            </div>

          )}

        </div>

      </main>

      {/* FOOTER */}

      <footer className="cart-footer">

        <div className="cart-footer-brand">

          <strong>LAGOSTIM DE MZ</strong>

          <span>
            O sabor do mar à sua mesa.
          </span>

        </div>

        <a href="/menu">
          Ver menu completo
          <span aria-hidden="true">→</span>
        </a>

      </footer>

    </div>
  );
}

export default Cart;
