import { useState } from 'react';
import Card from '../components/Card';
import { InputField } from '../components/InputField';
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
        console.log("Token", data.token);
      
        
      navigate("/home", {replace:true});
           }
       catch(err){
        alert("Login failed");
       } finally{
        setLoading(false);
       }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <Card>
                <div className='text-4xl'>
                    <h1 className="text-4xl mb-6">Welcome User!</h1>
                    <div className="text-xl text-black space-y-6">
                        <InputField label="Email" value={email} onChange={setEmail} />
                        <InputField label="Password" value={password} onChange={setPassword} />

                        <p className='text-base'>
                            New user?
                            <a href="/signup" className="text-blue-500 text-base hover:underline">
                                Sign Up
                            </a>
                        </p>
                        <button
                            className="w-full bg-blue-500 text-white p-1 rounded-[1vw] hover:bg-blue-600"
                            onClick={handleLogin} disabled={loading}
                            >
                            Login
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}