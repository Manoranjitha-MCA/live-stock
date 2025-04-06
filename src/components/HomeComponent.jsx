import React from 'react';
import { motion } from 'framer-motion';
import logo from "../assets/logo.jpg";
const HomeComponent = () => {
  return (
        <motion.div 
          className="flex flex-col overflow-visible justify-center items-center text-center p-8 bg-white text-gray-800 rounded-xl min-h-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

<div className="flex flex-col items-center justify-center mb-6">
    <img 
      src={logo} 
      alt="Muthulakshmi Integrated Livestock Farm Logo" 
      className="w-96 h-auto" 
      style={{ maxWidth: '100%' }}
    />
    
    {/* Hero Section */}
    <motion.h1
      className="text-4xl md:text-5xl font-extrabold text-green-700 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      Welcome to Muthulakshmi Integrated Livestock Farm
    </motion.h1>
  </div>
    
          <motion.p 
            className="text-lg mb-4 max-w-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-semibold">Sustainable Farming, Premium Quality</span>
          </motion.p>
    
          <motion.p 
            className="text-lg mb-8 max-w-xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            At Muthulakshmi Integrated Livestock Farm, we are dedicated to sustainable and ethical farming, offering high-quality livestock and farm fish. Our commitment to excellence ensures that you receive the best products, nurtured with care and precision.
          </motion.p>
    
          {/* Specialties */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-3xl text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="p-4 bg-green-100 rounded-xl shadow-md">
              🌱 <span className="font-semibold">Sustainable Farming</span> – Eco-friendly methods that promote long-term agricultural success.
            </div>
            <div className="p-4 bg-blue-100 rounded-xl shadow-md">
              🐟 <span className="font-semibold">Fresh & Nutritious Seafood</span> – Premium-quality Murrel and Pomfret, raised in a healthy environment.
            </div>
            <div className="p-4 bg-yellow-100 rounded-xl shadow-md">
              🐖 <span className="font-semibold">High-Quality Livestock</span> – Well-bred White Yorkshire, Duroc, and Landrace pigs for superior meat production.
            </div>
            <div className="p-4 bg-gray-100 rounded-xl shadow-md">
              🌍 <span className="font-semibold">Global Standards</span> – We follow best practices to ensure quality, safety, and ethical farming.
            </div>
          </motion.div>
    
          {/* Why Choose Us? */}
          <motion.div 
            className="mt-12 text-center max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="text-2xl font-bold text-green-700 mb-4">Why Choose Us?</h2>
            <ul className="text-gray-700 space-y-2">
              <li>✅ Premium Quality Livestock & Farm fish</li>
              <li>✅ Sustainable & Ethical Farming Practices</li>
              <li>✅ Healthy & Well-Nurtured Breeds</li>
              <li>✅ Trusted by Farmers, Traders & Consumers</li>
            </ul>
          </motion.div>
        </motion.div>
      );
};

export default HomeComponent;
