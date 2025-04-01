import React from 'react';
import { motion } from 'framer-motion';
import murrel_fish from "../assets/images/murrel fish.jpg";
import pomfret_fish from "../assets/images/pomfret-fish.jpg";
import cattle_form from "../assets/images/cattle Image.jpg";
const HomeComponent = () => {
  return (
        <motion.div 
          className="flex flex-col overflow-visible justify-center items-center text-center p-8 bg-white text-gray-800 rounded-xl min-h-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <motion.h1 
            className="text-5xl font-extrabold mb-6 text-green-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to Muthulakshmi Integrated Livestock Farm
          </motion.h1>
    
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
            At Muthulakshmi Integrated Livestock Farm, we are dedicated to sustainable and ethical farming, offering high-quality livestock and seafood. Our commitment to excellence ensures that you receive the best products, nurtured with care and precision.
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
              <li>✅ Premium Quality Livestock & Seafood</li>
              <li>✅ Sustainable & Ethical Farming Practices</li>
              <li>✅ Healthy & Well-Nurtured Breeds</li>
              <li>✅ Trusted by Farmers, Traders & Consumers</li>
            </ul>
          </motion.div>
  
    
          {/* Images Section */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={cattle_form}
                alt="Cattle Farm" 
                className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300" 
              />
            </div>
    
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={murrel_fish}
                alt="Murrel Fish" 
                className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300" 
              />
            </div>
    
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={pomfret_fish}
                alt="Pomfret Fish" 
                className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300" 
              />
            </div>
          </motion.div>
        </motion.div>
      );
};

export default HomeComponent;
