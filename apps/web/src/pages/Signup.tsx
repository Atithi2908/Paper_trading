
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
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <Card>
                <div className='text-4xl'>
                    <h1 className="text-4xl mb-6 text-center">Sign Up!</h1>
                    <div className="text-xl text-black space-y-6">
                        <InputField label="Name" value={name} onChange={setName} />
                        <InputField label="Email" value={email} onChange={setEmail} />
                        <InputField label="Password" value={password} onChange={setPassword} />

                        <p className='text-base'>
                            Already existing user?
                            <a href="/" className="text-blue-500 text-base hover:underline">
                                login
                            </a>
                        </p>
                        <button
                            className="w-full bg-blue-500 text-white p-1 rounded-[1vw] hover:bg-blue-600"
                            onClick={handleLogin} disabled = {loading}
                        >
                            SignUp
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}