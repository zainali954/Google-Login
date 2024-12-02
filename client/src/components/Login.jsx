import React from "react";
import { FcGoogle } from "react-icons/fc"; 
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/authContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';

const Login =  () => {
  const { setLoading, setUser } = useAuth()
  const navigate = useNavigate()

  const GoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
        try {
            setLoading(true); 
            console.log(codeResponse);
            const response = await axios.post('http://localhost:5000/auth/google-login', {
                code: codeResponse.code, // Send the authorization code to your backend
            }, {
                withCredentials: true, // Important to include cookies
            });

            const data = response.data;

            if (data.success) {
                setUser(data.user); // Update the user state
                localStorage.setItem("user", JSON.stringify(data.user))
                toast.success(response.data.message || "Authenticated successfully" )
                navigate('/dashboard')
            } else {
                toast.error("Login failed, try again later.")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during login, please try again." )
        } finally {
            setLoading(false)
        }
    },
    flow: 'auth-code',
}); 

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#242424]">
    <button
      onClick={GoogleLogin}
      className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500 hover:ring-2 hover:ring-blue-300 transition duration-300"
    >
      <FcGoogle size={24} className="mr-3" />
      Continue with Google
    </button>
  </div>
  );
};

export default Login;
