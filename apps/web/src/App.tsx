import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

import Home from "./pages/Home";
import LandingPage from "./pages/Landing";
import { StockDetailsPage } from "./pages/Stock";

function App() {
    return( <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/stocks/:symbol" element={<StockDetailsPage/>} />
      </Routes>
    </Router>
    )
    
}

export default App
