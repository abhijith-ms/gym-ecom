import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-xl mb-6">Page Not Found</p>
    <Link to="/" className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">Go Home</Link>
  </div>
);

export default NotFound; 