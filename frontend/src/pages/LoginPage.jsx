import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from "../stores/useUserStore";
import { LogIn, Loader } from "lucide-react";




const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
	const { login, loading } = useUserStore();
  

  const handleLogin = (e) => {
		e.preventDefault();
		console.log(email, password);
		login(email, password);
    navigate('/');
	};
  const handleSignupRedirect = (e) => {
    e.preventDefault();
    navigate('/signup');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
           
          </div>
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold mb-4">Login</h1>
            <div className="w-full flex-1 mt-2">
              <div className="mx-auto max-w-xs">
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    id='email'
									type='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									
									placeholder='you@example.com'
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none cursor-pointer disabled={loading}">
                    {loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
									Login
								</>
							)}
              </button>
                </form>
                <button
                  onClick={handleSignupRedirect}
                  className="mt-3 tracking-wide font-semibold bg-indigo-100 text-indigo-700 w-full py-3 rounded-lg hover:bg-indigo-200 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none cursor-pointer">
                  <span className="ml-3">Go to Signup</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage