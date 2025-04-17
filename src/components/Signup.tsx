import React from 'react';
import taskaLogo from '../assets/taska.svg';

export default function Signup() {
  return (
    <div className="min-h-screen bg-gray-100 font-[poppins] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div className="flex items-center justify-center mb-4">
          <div className="p-2 rounded-md">
          <img className="" src={taskaLogo} alt="Taska Logo" />
          </div>
          <h1 className="text-2xl font-semibold ml-2">Taska</h1>
        </div>
        <h2 className="text-lg font-medium text-gray-700 mb-6">Welcome to Taska! 👋🏼</h2>
        
        <form>
           <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        <select name="role" id="role" className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
        <option value="web">Web Developer</option>
        <option value="ios">iOS Developer</option>
        <option value="android">Android Developer</option>
        <option value="QA">SQA</option>
          </select> 
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
          >
            LOGIN
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="#" className="text-indigo-500 font-medium hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
