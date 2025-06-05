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
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-[url('/background.png')] font-[poppins] flex items-center justify-center bg-no-repeat bg-[length:150%] bg-[position:bottom] sm:bg-[length:100%] sm:bg-[position:center_bottom]">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-sm mx-4">
        <div className="flex items-center justify-center mb-4">
          <img src={taskaLogo} alt="Taska Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-semibold ml-2">Taska</h1>
        </div>
        <h2 className="text-xl font-semibold leading-8 tracking-[0.18px] mb-4 text-[rgba(76,78,100,0.87)]">
          Welcome to Taska! <span className="text-2xl">👋🏻</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
    <input
      type="text"
      placeholder="Enter your name"
      {...register('fullName')}
      className="placeholder-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <p className="text-red-500 text-sm h-5">
      {errors.fullName?.message || ' '}
    </p>
<div className="relative">
    <select
      {...register('role')}
      defaultValue=""
      className="text-black appearance-none w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <option value="" disabled>Select your role</option>
      <option value="web">Web Developer</option>
      <option value="ios">iOS Developer</option>
      <option value="android">Android Developer</option>
      <option value="SQA">SQA</option>
    </select>
      <div className="absolute top-0 bottom-6 right-0 flex items-center px-3">
      <ChevronDown className="h-5 w-5 text-gray-500" />
    </div>
    <p className="text-red-500 text-sm h-5">
      {errors.role?.message || ' '}
    </p>
    </div>

    <input
      type="email"
      placeholder="Enter your email"
      {...register('email')}
      className="placeholder-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <p className="text-red-500 text-sm h-5">
      {errors.email?.message || ' '}
    </p>

    <div className="relative">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Enter your password"
    {...register('password')}
    className="placeholder-black w-full pr-10 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
  />
  <button
    type="button"
    onClick={() => setShowPassword(prev => !prev)}
    className="absolute top-0 bottom-6 right-0 flex items-center px-3"
  >
    {showPassword ? (
      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
    ) : (
      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
    )}
  </button>
  <p className="text-red-500 text-sm h-5">
    {errors.password?.message || ' '}
  </p>
</div>


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
