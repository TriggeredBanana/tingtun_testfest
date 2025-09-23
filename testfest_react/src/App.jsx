import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import OsloKommune from './pages/OsloKommune';
import Storebrand from './pages/Storebrand';
import UiO from './pages/UiO';
import FAQ from './pages/FAQ';
import Metode from './pages/Metode';

// Import your CSS files
import './assets/styles/styles.css';
import './assets/styles/index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/oslo-kommune" element={<OsloKommune />} />
          <Route path="/storebrand" element={<Storebrand />} />
          <Route path="/uio" element={<UiO />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/metode" element={<Metode />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;