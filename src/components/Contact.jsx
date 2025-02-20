import React from "react";
import { motion } from "framer-motion";
export function Contact() {
    return (
      <div className="p-8 bg-white min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Contact Us</h2>
        <motion.div 
          className="text-center text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg">Email: <a href="mailto:krishnakumarpoosaipandian@gmail.com" className="text-blue-500 hover:underline">krishnakumarpoosaipandian@gmail.com</a></p>
          <p className="text-lg mt-2">Phone: <a href="tel:+919884203988" className="text-blue-500 hover:underline">+91 98842 03988</a></p>
        </motion.div>
      </div>
    );
  }