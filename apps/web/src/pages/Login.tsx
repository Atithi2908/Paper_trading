import { useState } from 'react';
import {login} from "../services/auth";
import { useNavigate } from "react-router-dom";


export default function Login() {
    const navigate =  useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[loading,setLoading] = useState(false);

    const handleLogin = async() => {
       setLoading(true);
       try{
        const data = await login(email,password);
          localStorage.setItem("Token", data.token);
        console.log("Token after login", data.token);
      
        
      navigate("/home", {replace:true});
           }
       catch(err){
        alert("Login failed");
       } finally{
        setLoading(false);
       }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-page px-4">
            <div className="theme-card p-8 w-full max-w-md">
                <div className='text-center mb-8'>
                    <h1 className="text-3xl font-bold text-ink mb-2">Welcome Back!</h1>
                    <p className="text-secondary">Sign in to your account</p>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 theme-input bg-panel text-ink"
                            placeholder="your@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 theme-input bg-panel text-ink"
                            placeholder="••••••••"
                        />
                    </div>

                    <p className='text-sm text-center text-secondary'>
                        Don't have an account?
                        <a href="/signup" className="text-primary hover:text-contrast font-semibold ml-1">
                            Sign Up
                        </a>
                    </p>
                    <button
                        className="w-full btn-primary p-3 font-bold"
                        onClick={handleLogin} 
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
}
