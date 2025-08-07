import React from 'react';
import { Link } from 'react-router-dom';
import scarsLogo from '../assets/scars.png';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-scars-red/10 text-center px-4">
    <div className="flex flex-col items-center mb-8">
      <div className="bg-white/80 rounded-2xl shadow-lg p-4 mb-4">
        <img src={scarsLogo} alt="SCARS Clothing Brand" className="h-16 sm:h-24 object-contain drop-shadow" />
      </div>
      <h1 className="text-7xl sm:text-9xl font-black text-scars-red mb-2 tracking-tight drop-shadow">404</h1>
      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-xl">Oops! The page you are looking for does not exist or has been moved.<br />Let’s get you back to the home page.</p>
      <Link to="/" className="inline-flex items-center px-6 py-3 rounded-lg bg-scars-red text-white font-semibold text-lg shadow hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-scars-red/30">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V9.414a2 2 0 00-.586-1.414l-7-7a2 2 0 00-2.828 0l-7 7A2 2 0 003 9.414V19a2 2 0 002 2h3m10 0h-3" /></svg>
        Go Home
      </Link>
    </div>
    <div className="opacity-10 absolute inset-0 pointer-events-none select-none flex items-end justify-center">
      <span className="text-[10rem] sm:text-[16rem] font-black text-scars-red/20">SCARS</span>
    </div>
  </div>
);

export default NotFound; 