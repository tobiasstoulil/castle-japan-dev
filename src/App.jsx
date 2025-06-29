import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Leva } from "leva";

import HomePage from "./pages/Home/Index";
import NotFoundPage from "./pages/NotFoundPage";

import Loader from "./components/Loader";
// import PageWrapper from "./components/PageWrapper";
import Experience from "./components/Experience/Experience";
const App = () => {
  console.log("app r");

  return (
    <>
      <Loader />

      <div className="fixed inset-0 h-[100svh] w-full overflow-hidden">
        {/* <Navbar /> */}
        <Experience />
      </div>

      {/* <Leva collapsed hidden /> */}

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route index element={<HomePage />} />
          {/* <Route
            path="/about"
            element={
              <PageWrapper>
                <AboutPage />
              </PageWrapper>
            }
          /> */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
