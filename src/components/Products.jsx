import React from 'react';
import { motion } from 'framer-motion';
// import white_yorkshire from "https://ik.imagekit.io/p82gchbny/Large%20White%20Yorkshire?updatedAt=1743702022569sets/images/white-yorkshire.jpg"; 
// import duroc from "https://ik.imagekit.io/p82gchbny/Duroc?updatedAt=1743702022516sets/images/duroc.jpg";
// import landrace from "https://ik.imagekit.io/p82gchbny/Landrace?updatedAt=1743702022847ssets/images/landrace.jpg";
// import murrel_fish from "https://ik.imagekit.io/p82gchbny/Murrel%20Fish?updatedAt=1743702022506s/murrel fish.jpg";
// import pomfret_fish from "https://ik.imagekit.io/p82gchbny/Roopchand%20_%20Chinese%20Pomfret?updatedAt=1743702022438/images/pomfret-fish.jpg";

const products = [
  {
    id: 1,
    name: 'Murrel (Snakehead Fish)',
    description: 'A premium and highly sought-after freshwater fish known for its rich protein content, medicinal value, and delicious taste. Our Murrel fish are farmed using controlled environments to ensure the best quality and freshness.',
    image: "https://ik.imagekit.io/p82gchbny/Murrel%20Fish?updatedAt=1743702022506s/murrel fish.jpg"
  },
  {
    id: 2,
    name: 'Roopchand / Chinese Pomfret ',
    description: 'Roopchand / Chinses Pomfret is favourite among farm fish lovers with one single bone. Our farm produces high-quality Pomfret that is rich in Omega-3 fatty acids, promoting heart health and overall well-being.',
    image: "https://ik.imagekit.io/p82gchbny/Roopchand%20_%20Chinese%20Pomfret?updatedAt=1743702022438/images/pomfret-fish.jpg"
  },
  {
    id: 3,
    name: 'White Yorkshire ',
    description: 'One of the most widely raised pig breeds globally, White Yorkshire pigs are known for their lean meat, rapid growth, and adaptability. We ensure ethical breeding to maintain superior meat quality.',
    image: "https://ik.imagekit.io/p82gchbny/Large%20White%20Yorkshire?updatedAt=1743702022569sets/images/white-yorkshire.jpg"
  },
  {
    id: 4,
    name: 'Duroc',
    description: 'Recognized for its fast growth, excellent meat marbling, and disease resistance, Duroc pigs are an ideal choice for high-quality pork production. Our farm focuses on selective breeding to maintain the breed’s superior traits.',
    image: "https://ik.imagekit.io/p82gchbny/Duroc?updatedAt=1743702022516sets/images/duroc.jpg"
  },
  {
    id: 5,
    name: 'Landrace',
    description: 'A top-performing pig breed, Landrace pigs are valued for their exceptional mothering abilities and high litter sizes. They are an excellent choice for sustainable and profitable pork production.',
    image: "https://ik.imagekit.io/p82gchbny/Landrace?updatedAt=1743702022847ssets/images/landrace.jpg"
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
