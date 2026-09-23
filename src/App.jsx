import Home from "./pages/Home";
import Menu from "./pages/Menu";
import DishDetails from "./pages/DishDetails";

function App() {
  const path = window.location.pathname;

  // Página inicial
  if (path === "/") {
    return <Home />;
  }

  // Menu completo
  if (path === "/menu") {
    return <Menu />;
  }

  // Detalhes de um prato
  if (path.startsWith("/menu/")) {
    return <DishDetails />;
  }

  // Caso a página não exista,
  // volta para a página inicial
  return <Home />;
}

export default App;