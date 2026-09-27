
import { useEffect, useMemo, useState } from "react";
import { addToCart, getCart } from "../utils/cart";
import { supabase } from "../lib/supabase";

import "./Menu.css";

function Menu() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [addedItemId, setAddedItemId] = useState(null);
  const [showCartNotice, setShowCartNotice] = useState(false);

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = getCart();

    const count = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setCartCount(count);
  }, []);

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);

      const categoriesResult = await supabase
        .from("categories")
        .select("*")
        .order("name");

      const productsResult = await supabase
        .from("products")
        .select("*")
        .order("name");

      console.log("CATEGORIAS:", categoriesResult);
      console.log("PRODUTOS:", productsResult);

      if (categoriesResult.error) {
        console.error(
          "Erro ao carregar categorias:",
          categoriesResult.error
        );
      }

      if (productsResult.error) {
        console.error(
          "Erro ao carregar produtos:",
          productsResult.error
        );
      }

      setCategories(categoriesResult.data || []);
      setMenuItems(productsResult.data || []);

      setLoading(false);
    };

    loadMenu();
  }, []);

  const whatsappNumber = "258871538162";

  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de fazer um pedido no Lagostim de MZ."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "Preço não definido";
    }

    return `${Number(price).toLocaleString("pt-MZ")} MT`;
  };

  const handleAddToCart = (item) => {
    // Não permite adicionar pratos indisponíveis
    if (!item.available) {
      return;
    }

    const updatedCart = addToCart(item, 1);

    const count = updatedCart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setCartCount(count);

    setAddedItemId(item.id);
    setShowCartNotice(true);

    setTimeout(() => {
      setAddedItemId(null);
    }, 1500);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (category) => category.id === categoryId
    );

    return category?.name || "Menu";
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "todos" ||
        item.category_id === activeCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        item.name.toLowerCase().includes(searchText) ||
        (item.description || "")
          .toLowerCase()
          .includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, search]);

  return (
    <div className="menu-page">

      {/* =========================
          HEADER
      ========================= */}
      <header className="menu-header">

        <a href="/" className="menu-brand">
          <img
            src="/logo-lagostim.png"
            alt="Lagostim de MZ"
          />

          <span>Lagostim de MZ</span>
        </a>

        <div className="menu-header-actions">

          <a
            href="/cart"
            className="menu-header-cart"
          >
            <span className="menu-header-cart-icon">
              🛒
            </span>

            <span>
              Carrinho
            </span>

            {cartCount > 0 && (
              <strong>
                {cartCount}
              </strong>
            )}
          </a>

          <a
            href={whatsappUrl}
            className="menu-header-whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>

        </div>

      </header>


      {/* =========================
          AVISO DO CARRINHO
      ========================= */}
      {showCartNotice && cartCount > 0 && (
        <div className="menu-cart-notice">

          <div className="menu-cart-notice-content">

            <span className="menu-cart-notice-icon">
              ✓
            </span>

            <div>
              <strong>
                Pedido atualizado
              </strong>

              <span>
                {cartCount}{" "}
                {cartCount === 1
                  ? "item"
                  : "itens"}{" "}
                no carrinho
              </span>
            </div>

          </div>

          <a
            href="/cart"
            className="menu-cart-notice-button"
          >
            Ver carrinho
            <span>→</span>
          </a>

        </div>
      )}


      {/* =========================
          INTRO / HERO
      ========================= */}
      <section className="menu-intro">

        <div className="menu-intro-overlay"></div>

        <div className="menu-intro-content">

          <span className="menu-intro-label">
            LAGOSTIM DE MZ
          </span>

          <h1>
            Nosso <span>Menu</span>
          </h1>

          <p>
            Descubra os sabores do mar preparados
            especialmente para você.
          </p>

        </div>

        <div className="menu-intro-badge">
          <span>🦐</span>
          <strong>Sabores do mar</strong>
        </div>

      </section>


      {/* =========================
          MENU
      ========================= */}
      <main className="menu-content">

        {/* =========================
            PESQUISA
        ========================= */}
        <div className="menu-search-wrapper">

          <span className="menu-search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Pesquisar prato..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              className="menu-search-clear"
              onClick={() => setSearch("")}
              aria-label="Limpar pesquisa"
            >
              ×
            </button>
          )}

        </div>


        {/* =========================
            CATEGORIAS
        ========================= */}
        <section className="menu-category-section">

          <div className="menu-category-heading">

            <div>
              <span>
                EXPLORE
              </span>

              <h2>
                Escolha uma categoria
              </h2>
            </div>

            <p>
              Encontre o seu sabor favorito
            </p>

          </div>


          <div className="menu-categories">

            {/* TODOS */}
            <button
              type="button"
              className={`category-card ${
                activeCategory === "todos"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveCategory("todos")
              }
            >

              <span className="category-card-icon">
                🍽️
              </span>

              <span className="category-card-text">

                <strong>
                  Todos
                </strong>

                <small>
                  Ver tudo
                </small>

              </span>

              <span className="category-card-arrow">
                →
              </span>

            </button>


            {/* CATEGORIAS */}
            {categories.map((category) => (

              <button
                type="button"
                key={category.id}
                className={`category-card ${
                  activeCategory === category.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveCategory(category.id)
                }
              >

                <span className="category-card-icon">
                  {category.icon}
                </span>

                <span className="category-card-text">

                  <strong>
                    {category.name}
                  </strong>

                  <small>
                    Explorar
                  </small>

                </span>

                <span className="category-card-arrow">
                  →
                </span>

              </button>

            ))}

          </div>

        </section>


        {/* =========================
            RESULTADOS
        ========================= */}
        <div className="menu-results-header">

          <div>

            <span>
              MENU
            </span>

            <h2>
              {activeCategory === "todos"
                ? "Todos os pratos"
                : getCategoryName(activeCategory)}
            </h2>

          </div>

          <p>
            {filteredItems.length}{" "}
            {filteredItems.length === 1
              ? "prato"
              : "pratos"}
          </p>

        </div>


        {/* =========================
            PRATOS
        ========================= */}
        {filteredItems.length > 0 ? (

          <div className="menu-grid">

            {filteredItems.map((item) => (

              <article
                className={`menu-dish-card ${
                  !item.available
                    ? "unavailable"
                    : ""
                }`}
                key={item.id}
              >

                <a
                  href={`/menu/${item.id}`}
                  className="menu-dish-image"
                  aria-label={`Ver detalhes de ${item.name}`}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  {item.featured && (
                    <span className="menu-dish-featured">
                      Destaque
                    </span>
                  )}

                  {!item.available && (
                    <span className="menu-dish-unavailable">
                      Indisponível
                    </span>
                  )}

                  {item.available && (
                    <button
                      type="button"
                      className={`menu-dish-add ${
                        addedItemId === item.id
                          ? "added"
                          : ""
                      }`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleAddToCart(item);
                      }}
                      aria-label={`Adicionar ${item.name} ao pedido`}
                    >
                      {addedItemId === item.id
                        ? "✓"
                        : "+"}
                    </button>
                  )}

                  {addedItemId === item.id && (
                    <span className="menu-dish-added-message">
                      Adicionado ao pedido
                    </span>
                  )}

                </a>


                <div className="menu-dish-info">

                  <span className="menu-dish-category">
                    {getCategoryName(item.category_id)}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    {item.description ||
                      "Descrição não disponível."}
                  </p>


                  <div className="menu-dish-bottom">

                    <strong>
                      {formatPrice(item.price)}
                    </strong>

                    <a
                      href={`/menu/${item.id}`}
                      className="menu-view-button"
                    >
                      Ver prato
                      <span>→</span>
                    </a>

                  </div>

                </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="menu-empty">

            <span className="menu-empty-icon">
              🍽️
            </span>

            <h3>
              Nenhum prato encontrado
            </h3>

            <p>
              Tente pesquisar por outro nome
              ou selecionar outra categoria.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("todos");
              }}
            >
              Ver todos os pratos
            </button>

          </div>

        )}

      </main>


      {/* =========================
          WHATSAPP CTA
      ========================= */}
      <section className="menu-whatsapp-section">

        <div>

          <span>
            FAÇA O SEU PEDIDO
          </span>

          <h2>
            Gostou de algum prato?
          </h2>

          <p>
            Entre em contacto conosco pelo WhatsApp
            e faça o seu pedido.
          </p>

        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          Pedir pelo WhatsApp
          <span>→</span>
        </a>

      </section>


      {/* =========================
          FOOTER
      ========================= */}
      <footer className="menu-footer">

        <div>

          <strong>
            LAGOSTIM DE MZ
          </strong>

          <span>
            O sabor do mar à sua mesa.
          </span>

        </div>

        <a href="/">
          ← Página inicial
        </a>

      </footer>

    </div>
  );
}

export default Menu;
