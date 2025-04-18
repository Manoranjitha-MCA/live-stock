import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuOutlined } from '@ant-design/icons';
import logo from "../assets/images/logo.png"
const Navbar = ({ setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r bg-white text-green-700 shadow-md py-4 px-6 flex justify-between items-center relative">
      
      {/* Logo and Title */}
      <div className="flex items-center space-x-3">
        <img 
          src={logo}
          alt="Logo" 
          className="w-10 h-10 bg-gray-50 rounded-full object-fill " 
        />
        <motion.h1 
                    className="text-2xl font-extrabold text-green-700"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Muthulakshmi Integrated Livestock Farm
        </motion.h1>
      </div>

      {/* Mobile Menu Icon */}
      <button 
        className="lg:hidden text-2xl focus:outline-none" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuOutlined />
      </button>

      {/* Desktop Menu */}
      <motion.div 
        className="hidden lg:flex space-x-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {['Home','About Us', 'Products','Gallery','Why Choose Us','Contact Us', 'Login'].map((item, index) => (
          <motion.a 
            key={index}
            href="#"
            onClick={() => setCurrentPage(index)}
            className="text-green-700 text-lg font-medium transition-all duration-300 ease-in-out hover:text-white hover:bg-green-700 hover:px-3 hover:py-2 rounded-lg"
            whileHover={{ scale: 1.1 }}
          >
            {item}
          </motion.a>
        ))}
      </motion.div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          className="lg:hidden absolute top-16 left-0 w-full bg-green-700 text-white flex flex-col items-center space-y-4 py-4 shadow-md z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {['Home','About Us', 'Products','Gallery','Why Choose Us','Contact Us', 'Login'].map((item, index) => (
            <motion.a 
              key={index}
              href="#"
              onClick={() => { setCurrentPage(index); setIsOpen(false); }}
              className="text-white text-lg font-medium transition-all duration-300 ease-in-out hover:text-green-300 hover:bg-white hover:px-3 hover:py-2 rounded-lg"
              whileHover={{ scale: 1.1 }}
            >
              {item}
            </motion.a>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
