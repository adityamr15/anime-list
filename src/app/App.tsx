import { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { dispatch } from "../recontext";
import AnimeList from "./AnimeList";
import Collection from "./Collection";
import CollectionList from "./CollectionList";
import Detail from "./Detail";

function App() {
  const location = useLocation();
  const { innerHeight } = window;

  useEffect(() => {
    dispatch('CLEAR_SELECTION', null);
  }, [location])

  return (
    <div className="App">
      <Navbar />
      <div className="wrapper" style={{ minHeight: (innerHeight - 80) + "px" }}>
        <Routes>
          <Route path="/" element={<AnimeList />} />
          <Route path="/anime/:id" element={<Detail />} />
          <Route path="/collections" element={<CollectionList />} />
          <Route path="/collections/:id" element={<Collection />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
