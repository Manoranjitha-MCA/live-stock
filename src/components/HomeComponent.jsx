import React from 'react';
import { motion } from 'framer-motion';

const HomeComponent = () => {
  return (
    <motion.div 
      className="flex flex-col justify-center items-center text-center p-8 bg-white text-gray-800 rounded-xl min-h-screen"
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
        Muthulakshmi Integrated Cattle Farm
      </motion.h1>

      <motion.p 
        className="text-lg mb-4 max-w-xl text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Your dependable source for freshwater fish and premium cattle. Experience nutrient-rich fish varieties like <span className="font-semibold">Murrel</span> and <span className="font-semibold">Pomfret</span>, along with high-end cattle breeds like <span className="font-semibold">White Yorkshire</span>, <span className="font-semibold">Duroc</span>, and <span className="font-semibold">Landrace</span>.
      </motion.p>

      <motion.p 
        className="text-lg mb-8 max-w-xl text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Come experience the best of integrated livestock farming with us!
      </motion.p>

      {/* CTA Button */}
      <motion.button 
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition duration-300 shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Learn More
      </motion.button>

      {/* Images Section */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img 
            src="/cattle-farm.jpg" 
            alt="Cattle Farm" 
            className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300" 
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img 
            src="/murrel-fish.jpg" 
            alt="Murrel Fish" 
            className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300" 
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img 
            src="/pomfret-fish.jpg" 
            alt="Pomfret Fish" 
            className="object-cover w-full h-48 hover:scale-105 transition-transform duration-300" 
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomeComponent;
