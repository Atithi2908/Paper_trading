import axios from 'axios';
import { BASE_URL } from '@repo/config';


type AuthResponse ={token:string};


export const login = (email:string, password:string)=>
    axios.post<AuthResponse>("http://localhost:3000/user/login",{email,password})
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

   