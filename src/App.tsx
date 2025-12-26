import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AudioProvider } from "./components/AudioController";
import { GlobalAudioControl } from "./components/GlobalAudioControl";
import { IntroLetter } from "./scenes/IntroLetter";
import { SortingHat } from "./scenes/SortingHat";
import { LumosHall } from "./scenes/LumosHall";
import { MaraudersMap } from "./scenes/MaraudersMap";
import { MuseumLobby } from "./scenes/MuseumLobby";
import { MuseumRoom } from "./scenes/MuseumRoom";
import { FinalExhibit } from "./scenes/FinalExhibit";
import "./styles/globals.css";

function App() {
  return (
    <AudioProvider>
      <BrowserRouter>
        <GlobalAudioControl />
        <Routes>
          <Route path="/" element={<IntroLetter />} />
          <Route path="/sorting" element={<SortingHat />} />
          <Route path="/lumos" element={<LumosHall />} />
          <Route path="/map" element={<MaraudersMap />} />
          <Route path="/museum" element={<MuseumLobby />} />
          <Route path="/museum/:roomId" element={<MuseumRoom />} />
          <Route path="/final" element={<FinalExhibit />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AudioProvider>
  );
}

export default App;
