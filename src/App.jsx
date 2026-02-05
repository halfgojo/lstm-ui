import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import VisualAnalysis from './pages/VisualAnalysis';
import Methodology from './pages/Methodology';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analysis" element={<VisualAnalysis />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
