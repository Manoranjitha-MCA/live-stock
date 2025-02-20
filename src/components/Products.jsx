import React from 'react';
import { motion } from 'framer-motion';
import white_yorkshire from "../assets/images/white-yorkshire.jpg"; 
import duroc from "../assets/images/duroc.jpg";
import landrace from "../assets/images/landrace.jpg";
import murrel_fish from "../assets/images/murrel fish.jpg";
import pomfret_fish from "../assets/images/pomfret-fish.jpg";

const products = [
  {
    id: 1,
    name: 'White Yorkshire',
    description: 'Rich source of high-quality protein, essential for muscle growth and repair.',
    image: white_yorkshire
  },
  {
    id: 2,
    name: 'Duroc',
    description: 'Contains vital B vitamins such as B1, B6, and B12, supporting metabolism and nerve function.',
    image: duroc
  },
  {
    id: 3,
    name: 'Landrace',
    description: 'High-end breed known for red blood cell production and muscle health.',
    image: landrace
  },
  {
    id: 4,
    name: 'Murrel Fish',
    description: 'Packed with omega-3 and omega-6 fatty acids, supporting heart and brain health.',
    image: murrel_fish
  },
  {
    id: 5,
    name: 'Pomfret Fish',
    description: 'Offers exceptional health benefits with essential amino acids for tissue repair.',
    image: pomfret_fish
  },
];

const Products = () => {
  return (
    <div className="p-8 bg-white min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl overflow-y-auto max-h-[70vh] px-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Products;
