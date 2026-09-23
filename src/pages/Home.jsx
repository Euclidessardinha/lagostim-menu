import "./Home.css";

function Home() {
  const whatsappNumber = "258871538162";

  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de fazer um pedido no Lagostim de MZ."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="home-page">

      {/* =========================
          HEADER
      ========================= */}
      <header className="home-header">
        <a href="/" className="home-brand">
          <img
            src="/logo-lagostim.png"
            alt="Lagostim de MZ"
          />

          <span>Lagostim de MZ</span>
        </a>

        <a
          href={whatsappUrl}
          className="home-header-whatsapp"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </header>


      {/* =========================
          HERO
      ========================= */}
      <main>
        <section className="home-hero">

          <div className="home-hero-overlay"></div>

          <div className="home-hero-content">

            <span className="home-hero-label">
              LAGOSTIM DE MZ
            </span>

            <h1>
              O sabor do mar
              <br />
              <span>à sua mesa.</span>
            </h1>

            <p>
              Descubra uma experiência de sabores
              inspirados no melhor do mar.
            </p>

            <div className="home-hero-actions">

              <a
                href="/menu"
                className="home-button home-button-primary"
              >
                Ver Menu
                <span>→</span>
              </a>

              <a
                href={whatsappUrl}
                className="home-button home-button-secondary"
                target="_blank"
                rel="noreferrer"
              >
                Fazer Pedido
                <span>↗</span>
              </a>

            </div>

          </div>


          <div className="home-hero-scroll">
            <span>EXPLORE</span>

            <span className="home-scroll-line"></span>
          </div>

        </section>


        {/* =========================
            VISITE-NOS
        ========================= */}
        <section className="home-visit">

          <div className="home-visit-header">

            <span>VENHA CONHECER</span>

            <h2>
              Visite-nos
              <span>.</span>
            </h2>

            <p>
              Estamos à sua espera para proporcionar
              uma experiência especial.
            </p>

          </div>


          <div className="home-visit-grid">

            {/* LOCALIZAÇÃO */}
            <div className="home-visit-card">

              <div className="home-visit-icon">
                ⌖
              </div>

              <div>
                <span>LOCALIZAÇÃO</span>

                <h3>
                  Lagostim de MZ
                </h3>

                <p>
                  Moçambique
                </p>
              </div>

            </div>


            {/* HORÁRIO */}
            <div className="home-visit-card">

              <div className="home-visit-icon">
                ◷
              </div>

              <div>
                <span>HORÁRIO</span>

                <h3>
                  Estamos à sua espera
                </h3>

                <p>
                  Consulte o nosso horário
                </p>
              </div>

            </div>


            {/* CONTACTO */}
            <div className="home-visit-card">

              <div className="home-visit-icon">
                ◉
              </div>

              <div>
                <span>CONTACTO</span>

                <h3>
                  WhatsApp
                </h3>

                <p>
                  Fale connosco diretamente
                </p>
              </div>

            </div>

          </div>


          <div className="home-visit-action">

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Falar pelo WhatsApp

              <span>
                →
              </span>
            </a>

          </div>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}
      <footer className="home-footer">

        <div className="home-footer-brand">

          <strong>
            LAGOSTIM DE MZ
          </strong>

          <span>
            O sabor do mar à sua mesa.
          </span>

        </div>


        <div className="home-footer-links">

          <a href="/menu">
            Ver Menu
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Fazer Pedido
          </a>

        </div>


        <div className="home-footer-copy">

          © {new Date().getFullYear()} Lagostim de MZ

        </div>

      </footer>

    </div>
  );
}

export default Home;