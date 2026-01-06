import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

import Home from "./pages/Home";
import LandingPage from "./pages/Landing";
import { StockDetailsPage } from "./pages/Stock";
import Portfolio from "./pages/Portfolio";
import OrderHistory from "./pages/OrderHistory";
import TradeHistory from "./pages/TradeHistory";

function App() {
    return( <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
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
