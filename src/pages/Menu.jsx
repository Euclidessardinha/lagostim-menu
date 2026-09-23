import { useMemo, useState } from "react";
import { categories, menuItems } from "../data/menuData";
import "./Menu.css";

function Menu() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [search, setSearch] = useState("");

  const whatsappNumber = "258871538162";

  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de fazer um pedido no Lagostim de MZ."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const formatPrice = (price) => {
    return `${price.toLocaleString("pt-MZ")} MT`;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (category) => category.id === categoryId
    );

    return category?.name || "Menu";
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (!item.available) return false;

      const matchesCategory =
        activeCategory === "todos" ||
        item.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        item.name.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

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

        <a
          href={whatsappUrl}
          className="menu-header-whatsapp"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>

      </header>


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
              <span>EXPLORE</span>

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
                <strong>Todos</strong>
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

            <span>MENU</span>

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
                className="menu-dish-card"
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

                  <span
                    className="menu-dish-add"
                    aria-hidden="true"
                  >
                    +
                  </span>

                </a>


                <div className="menu-dish-info">

                  <span className="menu-dish-category">
                    {getCategoryName(item.category)}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    {item.description}
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