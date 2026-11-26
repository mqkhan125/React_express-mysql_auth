import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import API from "../utils/axiosInstance";


const Home = () => {

  const [user , setUser] = useState(null);
  const [loading , setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async() => {
      try {
        const response = await API.get('/auth/profile')
        console.log('fetch data')
        setUser(response.data.data)
      } catch (error) {
        console.log(error)
        localStorage.removeItem('token')
        navigate('/login', {replace : true})
      } finally{
        setLoading(false)
      }
    }
    
    fetchProfile()
  },[navigate])
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login', {replace : true})
  };

  if(loading){
    return <h1>Loading profile....</h1>
  }

    if (!user) {
      return null;
    }
    
return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100 flex flex-col justify-between p-6">
    {/* Navbar / Header */}
    <nav className="max-w-4xl w-full mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-extrabold text-indigo-600 tracking-tight">
        MyAuth Dashboard
      </h1>
      <button
        onClick={handleLogout}
        className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-4 py-2 rounded-xl text-sm transition-all duration-200"
      >
        Logout
      </button>
    </nav>

    {/* Main Content Card */}
    <main className="max-w-4xl w-full mx-auto my-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-200">
          {user.username ? user.username.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.username}! 👋
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Account Information
        </h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-gray-400 block text-xs font-medium uppercase tracking-wider">
              User ID
            </span>
            <span className="font-semibold text-gray-700">{user.id}</span>
          </div>
        </div>
      </div>
    </main>

    {/* Footer */}
    <footer className="text-center text-xs text-gray-400">
      &copy; 2026 MyAuth Application. All rights reserved.
    </footer>
  </div>
);
  
};

export default Home;
