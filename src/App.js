import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
  RouterProvider,
} from "react-router-dom";
import COT from "./pages/COT";
import { useEffect } from "react";
import Login from "./components/Login";
import Signin from "./components/Signin";
import Header from "./components/Header";
import MainSection from "./components/MainSection";
import SecondSection from "./components/SecondSection";
// import Header from "./components/Header";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/COT" element={<COT/>}/>
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Main" element={<MainSection />} />
        <Route path="/Dashboard" element={<SecondSection />} />
      </Routes>
    </>
  );
}

export default App;
