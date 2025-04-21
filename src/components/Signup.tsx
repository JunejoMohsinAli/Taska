import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import taskaLogo from '../assets/taska.svg';
import { Link, useNavigate } from 'react-router-dom';
import { signupSchema, SignupData } from '../utils/auth';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupData) => {
    // Get current users to empty array
    const users: SignupData[] = JSON.parse(localStorage.getItem('users') || '[]');
  
    // Extract fields
    const { fullName, role, email, password } = data;
  
    // Push new user to array
    users.push({ fullName, role, email, password, });
  
    // Save updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(users));
  
    // Store current logged-in user
    localStorage.setItem('currentUser', email);
  
    console.log('User signed up:', { fullName, role, email });
  
    // Redirect to login 
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-[poppins] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div className="flex items-center justify-center mb-4">
          <img src={taskaLogo} alt="Taska Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-semibold ml-2">Taska</h1>
        </div>
        <h2 className="text-lg font-medium text-gray-700 mb-6">Welcome to Taska! 👋🏼</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Full Name"
            {...register('fullName')} 
            className="placeholder-black w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mb-2">
              {errors.fullName.message}
            </p>
          )}

          <select
            {...register('role')}
            defaultValue=""
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="" disabled>Select Role</option>
            <option value="web">Web Developer</option>
            <option value="ios">iOS Developer</option>
            <option value="android">Android Developer</option>
            <option value="SQA">SQA</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mb-2">
              {errors.role.message}
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="placeholder-black w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">
              {errors.email.message}
            </p>
          )}

          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password')}
              className="placeholder-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword
                ? <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                : <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              }
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mb-4">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
          >
            SIGN UP
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-500 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}