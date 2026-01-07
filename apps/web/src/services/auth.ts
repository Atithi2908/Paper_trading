import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


type AuthResponse ={token:string};


export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log("Calling login API with:", email);
    const res = await axios.post<AuthResponse>(
      `${BASE_URL}/user/login`,
      { email, password }
    );

    console.log("Full axios response:", res);
    console.log("Response status:", res.status);
    console.log("Response data:", res.data);
    console.log("Token from response:", res.data?.token);
    console.log("Type of token:", typeof res.data?.token);

    return res.data;
  } catch (err: any) {
    console.error("Login API error:", err);
    console.error("Error response:", err.response?.data);
    console.error("Error status:", err.response?.status);
    throw err;
  }
};


export const signup = (name:string, email:string, password:string)=>
    axios.post<AuthResponse>(`${BASE_URL}/user/signup`, {name,email,password})
           .then(res=>res.data)
           .catch(err =>{
            console.error(err.response?.data);
            throw err;
            });

   