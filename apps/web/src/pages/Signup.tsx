
import { useState } from 'react';
import Card from '../components/Card';
import { InputField } from '../components/InputField';
import { signup } from '../services/auth';
import { useNavigate } from 'react-router-dom';
export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const data = await signup(name, email, password);
            localStorage.setItem("Token", data.token);
        console.log("Token", data.token);
      
        
      navigate("/home",{replace:true});
        }
        catch (e) {
            console.log(e);
            alert(e);
        } finally {
            setLoading(false);
        }


    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800 px-4">
            <Card>
                <div className='text-2xl sm:text-3xl md:text-4xl'>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-center">Sign Up!</h1>
                    <div className="text-base sm:text-lg md:text-xl text-black space-y-4 sm:space-y-6">
                        <InputField label="Name" value={name} onChange={setName} />
                        <InputField label="Email" value={email} onChange={setEmail} />
                        <InputField label="Password" value={password} onChange={setPassword} />

                        <p className='text-sm sm:text-base'>
                            Already existing user?
                            <a href="/" className="text-blue-500 text-sm sm:text-base hover:underline ml-1">
                                login
                            </a>
                        </p>
                        <button
                            className="w-full bg-blue-500 text-white p-2 sm:p-3 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                            onClick={handleLogin} disabled = {loading}
                        >
                            {loading ? 'Loading...' : 'SignUp'}
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}