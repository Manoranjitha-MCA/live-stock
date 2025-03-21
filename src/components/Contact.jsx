import React from "react";
import { motion } from "framer-motion";

export function Contact() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <motion.div 
        className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>

        <motion.div 
          className="text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg">
            Email:{" "}
            <a href="mailto:krishnakumarpoosaipandian@gmail.com" className="text-blue-500 hover:underline">
              krishnakumarpoosaipandian@gmail.com
            </a>
          </p>
          <p className="text-lg mt-2">
            Phone:{" "}
            <a href="tel:+919884203988" className="text-blue-500 hover:underline">
              +91 98842 03988
            </a>
          </p>
        </motion.div>

        {/* Google Maps Embed */}
        <motion.div 
          className="mt-6 rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <iframe
            title="Google Maps Location"
            className="w-full h-64 rounded-lg"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.488448946476!2d77.694528974644!3d11.004556854107137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8585284bb60ff%3A0x8dfe5f5b3c6e7bfb!2sCoimbatore%2C%20Tamil%20Nadu%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </motion.div>
    </div>
  );
}
