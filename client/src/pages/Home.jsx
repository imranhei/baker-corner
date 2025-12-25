import React from 'react'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-teal-100 flex flex-col items-center justify-center p-4">
      {/* Main container */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with bakery-themed background */}
        <div className="bg-gradient-to-r from-sky-500 to-teal-400 p-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Bakers Corner</h1>
          <p className="text-sky-100 text-lg">Freshly baked happiness daily</p>
        </div>
        
        {/* Welcome content */}
        <div className="p-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-sky-100 rounded-full flex items-center justify-center mb-6">
              <img src="/bakers_corner_logo.svg" alt="Bakers Logo" className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Bakers Corner!</h2>
            <p className="text-gray-600 mb-6">Inventory Management System</p>
          </div>
          
          {/* Login button */}
          <Link to="/login" className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-semibold rounded-lg shadow-md transition duration-300 transform focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75">
            Login to Your Account
          </Link>
        </div>
      </div>
      
      {/* Footer note */}
      <p className="mt-8 text-gray-500 text-sm">© {new Date().getFullYear()} Bakers Corner. All rights reserved.</p>
    </div>
  );
}

export default Home
