import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "@/pages/Menu";
import SoloGame from "@/pages/SoloGame";
import VsGame from "@/pages/VsGame";
import HowToPlay from "@/pages/HowToPlay";
import HighScores from "@/pages/HighScores";

export default function App() {
  return (
    <div className="App scanlines vignette">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/play" element={<SoloGame />} />
          <Route path="/vs" element={<VsGame />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/scores" element={<HighScores />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
