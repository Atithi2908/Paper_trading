import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

import Home from "./pages/Home";
import LandingPage from "./pages/Landing";
import { StockDetailsPage } from "./pages/Stock";
import Portfolio from "./pages/Portfolio";
import OrderHistory from "./pages/OrderHistory";
import TradeHistory from "./pages/TradeHistory";
import ExchangePage from "./pages/ExchangePage";
import DerivativesPage from "./pages/DerivativesPage";
import LearnPage from "./pages/LearnPage";
import FaqPage from "./pages/FaqPage";
import SnapshotsPage from "./pages/SnapshotsPage";

function App() {
    return( <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/exchange" element={<ExchangePage />} />
        <Route path="/derivatives" element={<DerivativesPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/snapshots" element={<SnapshotsPage />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/stocks/:symbol" element={<StockDetailsPage/>} />
        <Route path="/portfolio" element={<Portfolio/>}/>
        <Route path="/orders" element={<OrderHistory/>}/>
        <Route path="/trades" element={<TradeHistory/>}/>
        
      </Routes>
    </Router>
    )
    
}

export default App
