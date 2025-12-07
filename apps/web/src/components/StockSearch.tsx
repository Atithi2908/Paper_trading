import React, {useState,useEffect} from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

interface Stock{
    symbol : string;
    description: string
}

interface StockSearchProps {
    query: string;
}

export const StockSearch: React.FC<StockSearchProps>= ({query})=>{
   const [results,setResults] = useState<Stock[]>([]);
   const[loading,setLoading ] = useState(false);
   const navigate = useNavigate();

useEffect(()=>{
    if(!query){
        setResults([]);
        return ;
    }
    const delayDebounce = setTimeout(()=>{
        fetchResults(query);
    }, 500 );
    return ()=>clearTimeout(delayDebounce);
},[query]);

const fetchResults = async(searchTerm: string)=>{
    setLoading(true);
    console.log(`https://finnhub.io/api/v1/search?q=${searchTerm}&token=${FINNHUB_KEY}`)
    try{
        const res = await axios.get(
     `https://finnhub.io/api/v1/search?q=${searchTerm}&token=${FINNHUB_KEY}`
        )
setResults(res.data.result||[]);
    }catch(err){
        console.error("Error fetching stocks", err);
    }
    setLoading(false);
};
if(!query) return null;
   
   return (
   <div className="absolute top-full left-0 w-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {loading && (
        <p className="text-gray-400 text-center p-2">Loading...</p>
      )}

      {!loading && results.length === 0 && (
        <p className="text-gray-400 text-center p-2">No results found.</p>
      )}

      {!loading &&
        results.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => navigate(`/stocks/${stock.symbol}`)}
            className="p-2 hover:bg-gray-700 cursor-pointer transition"
          >
            <p className="text-white font-medium">{stock.symbol}</p>
            <p className="text-gray-400 text-sm">{stock.description}</p>
          </div>
        ))}
    </div>
   );
}