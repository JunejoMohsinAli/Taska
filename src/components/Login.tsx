import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import taskaLogo from '../assets/taska.svg';
import { Link } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up your actual login logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 font-[poppins] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <img src={taskaLogo} alt="Taska Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-semibold ml-2">Taska</h1>
        </div>

        <h2 className="text-lg font-medium text-gray-700 mb-6">
          Welcome back! 👋🏼
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Password */}
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
          >
            LOG IN
          </button>
        </form>

        {/* Switch to Signup */}
        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-indigo-500 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}