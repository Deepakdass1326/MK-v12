import { Suspense } from "react";
import Header from "./components/Header";
import HeroFeatureScene from "./components/HeroFeatureScene";
import SpecsStrip from "./components/SpecsStrip";
import CustomizeSection from "./components/CustomizeSection";
import Footer from "./components/Footer";
import Reticle from "./components/Reticle";
import Loader from "./components/Loader";

export default function App() {
  return (
    <div id="top">
      <Loader />
      <Reticle />
      <Header />
      <Suspense fallback={null}>
        <HeroFeatureScene />
      </Suspense>
      <SpecsStrip />
      <CustomizeSection />
      <Footer />
    </div>
  );
}
