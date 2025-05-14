import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import taskaLogo from '../assets/taska.svg';
import { Link, useNavigate } from 'react-router-dom';
import { signupSchema, SignupData } from '../utils/auth';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupData) => {
    setLoading(true);
    const { email, password, fullName, role } = data;

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          role,
        },
      },
    });

    setLoading(false);

    if (error) {
      return toast.error(
        error.message.includes('already registered')
          ? 'This email is already in use.'
          : `Signup failed: ${error.message}`
      );
    }

    if (!signUpData?.user) {
      return toast.error('Signup failed. Please try again.');
    }

    toast.success('Signup successful! Check your email to verify.');
    window.location.href = 'https://taska-lovat.vercel.app/';
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-[url('/background.png')] font-[poppins] flex items-center justify-center bg-no-repeat bg-[length:150%] bg-[position:bottom] sm:bg-[length:100%] sm:bg-[position:center_bottom]">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-sm mx-4">
        <div className="flex items-center justify-center mb-4">
          <img src={taskaLogo} alt="Taska Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-semibold ml-2">Taska</h1>
        </div>
        <h2 className="text-lg font-medium text-gray-700 mb-1">
          Welcome to Taska! <span className="text-xl">👋🏻</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Enter your name"
            {...register('fullName')}
            className="placeholder-black w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mb-2">{errors.fullName.message}</p>
          )}

          <div className='relative'>
            <select
              {...register('role')}
              defaultValue=""
              className="text-black appearance-none w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="" disabled className="text-black">
                Select your role
              </option>
              <option value="web">Web Developer</option>
              <option value="ios">iOS Developer</option>
              <option value="android">Android Developer</option>
              <option value="SQA">SQA</option>
            </select>
            <div className="absolute top-0 bottom-3 right-0 flex items-center px-3 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm mb-2">{errors.role.message}</p>
          )}

          <input
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            className="placeholder-black w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
          )}

          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              {...register('password')}
              className="placeholder-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
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
            <p className="text-red-500 text-sm mb-4">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md transition ${
              loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'
            }`}
          >
            {loading ? 'Signing Up...' : 'SIGN UP'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-800">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-500 visited:text-indigo-800 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
