import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/images/logo.jpeg";
import white_yorkshire from "../assets/images/white-yorkshire.jpg"; 
import duroc from "../assets/images/duroc.jpg";
import landrace from "../assets/images/landrace.jpg";
import murrel_fish from "../assets/images/murrel fish.jpg";
import pomfret_fish from "../assets/images/pomfret-fish.jpg";

// Gallery Component
export function Gallery() {
  const images = [
    logo,
    white_yorkshire,
    duroc,
    landrace,
    murrel_fish,
    pomfret_fish
  ];

  return (
    <div className="p-8 bg-white min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Gallery</h2>
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {images.map((src, index) => (
          <motion.img
            key={index}
            src={src}
            alt={`Gallery image ${index + 1}`}
            className="w-full h-48 object-cover rounded-xl shadow-lg"
            whileHover={{ scale: 1.1, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        ))}
      </motion.div>
    </div>
  );
}