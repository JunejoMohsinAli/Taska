import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import taskaLogo from '../assets/taska.svg';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, LoginData } from '../utils/auth';
import { supabase } from '../utils/supabaseClient';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    const { email, password } = data;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      alert(`Login failed: ${error.message}`);
    } else {
      console.log('Logged in as:', email);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-[url('/background.png')] font-[poppins] flex items-center justify-center bg-no-repeat bg-[length:150%] bg-[position:bottom] sm:bg-[length:100%] sm:bg-[position:center_bottom]" >      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <img src={taskaLogo} alt="Taska Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-semibold ml-2">Taska</h1>
        </div>

        <h2 className="text-lg font-medium text-gray-700 mb-1">
          Welcome back! <span className="text-xl">👋🏻</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            className="placeholder-black w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">
              {errors.email.message}
            </p>
          )}

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              className="placeholder-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mb-4">
              {errors.password.message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
          >
            LOG IN
          </button>
        </form>

        {/* Switch to Signup */}
        <p className="mt-4 text-sm text-gray-800">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-indigo-500 visited:text-indigo-800 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}