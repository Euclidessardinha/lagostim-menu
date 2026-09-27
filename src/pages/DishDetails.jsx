
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { addToCart } from "../utils/cart";


import "./DishDetails.css";

function DishDetails() {

  const [quantity, setQuantity] = useState(1);
  const [item, setItem] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const pathParts = window.location.pathname
    .split("/")
    .filter(Boolean);

  const itemId = pathParts[pathParts.length - 1];

  useEffect(() => {
    const loadDish = async () => {
      setLoading(true);

      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", itemId)
        .eq("available", true)
        .maybeSingle();

      if (error) {
        console.error(
          "Erro ao carregar prato:",
          error
        );

        setItem(null);
        setLoading(false);
        return;
      }

      if (!product) {
        setItem(null);
        setLoading(false);
        return;
      }

      setItem(product);

      const { data: categoryData, error: categoryError } =
        await supabase
          .from("categories")
          .select("*")
          .eq("id", product.category_id)
          .maybeSingle();

      if (categoryError) {
        console.error(
          "Erro ao carregar categoria:",
          categoryError
        );
      }

      setCategory(categoryData || null);
      setLoading(false);
    };

    loadDish();
  }, [itemId]);

  const formatPrice = (price) => {
    return `${price.toLocaleString("pt-MZ")} MT`;
  };

  const handleAddToCart = () => {
    addToCart(item, quantity);

    window.location.href = "/cart";
  };


  if (loading) {
    return (
      <div className="dish-details-page">
        <div className="dish-not-found">
          <h1>Carregando prato...</h1>

          <p>
            Aguarde enquanto carregamos os detalhes.
          </p>
        </div>
      </div>
    );
  }
  

  if (!item) {
    return (
      <div className="dish-details-page">
        <div className="dish-not-found">
          <span className="dish-not-found-icon">
            🍽️
          </span>

          <h1>Prato não encontrado</h1>

          <p>
            O prato que você está procurando não está
            disponível neste momento.
          </p>

          <a
            href="/menu"
            className="dish-back-button"
          >
            ← Voltar ao menu
          </a>
        </div>
      </div>
    );
  }

  const ingredients = item.ingredients?.length
    ? item.ingredients
    : ["Ingredientes a consultar"];

  

  return (
    <div className="dish-details-page">

      {/* =========================
          HEADER
      ========================= */}
      <header className="dish-details-header">

        <a
          href="/"
          className="dish-details-brand"
        >
          <img
            src="/logo-lagostim.png"
            alt="Lagostim de MZ"
          />

          <span>
            Lagostim de MZ
          </span>
        </a>

        {/*<a
          href={whatsappUrl}
          className="dish-header-whatsapp"
          target="_blank"
          rel="noreferrer"
        >
          <span>◉</span>
          WhatsApp
        </a>*/}

      </header>


      {/* =========================
          MAIN
      ========================= */}
      <main className="dish-details-main">

        <a
          href="/menu"
          className="dish-back-link"
        >
          ← Voltar ao menu
        </a>


        <div className="dish-details-container">

          {/* =========================
              IMAGEM
          ========================= */}
          <div className="dish-details-image-wrapper">

            <img
              src={item.image}
              alt={item.name}
              className="dish-details-image"
            />

            {item.featured && (
              <span className="dish-details-featured">
                ⭐ Destaque
              </span>
            )}

          </div>


          {/* =========================
              INFORMAÇÕES
          ========================= */}
          <div className="dish-details-info">

            <span className="dish-details-category">
              {category?.name || "Menu"}
            </span>

            <h1>
              {item.name}
            </h1>

            <div className="dish-details-price">
              {formatPrice(item.price)}
            </div>


            {/* INFORMAÇÕES RÁPIDAS */}
            <div className="dish-quick-info">

              <div className="dish-quick-item">

                <span className="dish-quick-icon">
                  ⏱
                </span>

                <div>
                  <small>
                    Preparação
                  </small>

                  <strong>
                    {item.preparation_time ||
                      "A consultar"}
                  </strong>
                </div>

              </div>


              <div className="dish-quick-item">

                <span className="dish-quick-icon">
                  🍽
                </span>

                <div>
                  <small>
                    Porção
                  </small>

                  <strong>
                    {item.portion ||
                      "A consultar"}
                  </strong>
                </div>

              </div>


              <div className="dish-quick-item">

                <span className="dish-quick-icon">
                  ✓
                </span>

                <div>
                  <small>
                    Status
                  </small>

                  <strong>
                    {item.available
                      ? "Disponível"
                      : "Indisponível"}
                  </strong>
                </div>

              </div>

            </div>


            {/* SOBRE O PRATO */}
            <div className="dish-about">

              <h2>
                Sobre este prato
              </h2>

              <p>
                {item.description}
              </p>

            </div>


            {/* INGREDIENTES */}
            <div className="dish-ingredients">

              <h2>
                Ingredientes
              </h2>

              <div className="ingredients-list">

                {ingredients.map(
                  (ingredient, index) => (
                    <div
                      className="ingredient-item"
                      key={`${ingredient}-${index}`}
                    >

                      <span className="ingredient-icon">
                        ✓
                      </span>

                      <span>
                        {ingredient}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>


            {/* WHATSAPP */}
            {item.available && (
              <button
                type="button"
                className="dish-whatsapp-button"
                onClick={handleAddToCart}
              >

              <span className="whatsapp-icon">
                🛒
              </span>

              

              <span>

                <small>
                  FAÇA O SEU PEDIDO
                </small>


                <strong>
                  Adicionar ao pedido
                </strong>

              </span>

              <span className="whatsapp-arrow">
                →
              </span>

              </button>
            )}

          </div>

        </div>

      </main>


      {/* =========================
          FOOTER
      ========================= */}
      <footer className="dish-details-footer">

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

export default DishDetails;