import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


type AuthResponse ={token:string};


export const login = (email:string, password:string)=>
    axios.post<AuthResponse>(`${BASE_URL}/user/login`,{email,password})
        .then(res=>res.data)
        .catch(err=>{
            console.error(err.response?.data);
            throw err;
        });
    
export const signup = (name:string, email:string, password:string)=>
    axios.post<AuthResponse>(`${BASE_URL}/user/signup`, {name,email,password})
           .then(res=>res.data)
           .catch(err =>{
            console.error(err.response?.data);
            throw err;
            });

   