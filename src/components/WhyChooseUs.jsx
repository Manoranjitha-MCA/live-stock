import { motion } from 'framer-motion';

export default function WhyChooseUs() {
  return (
    <motion.div 
      className="flex flex-col justify-center items-center text-center p-8 bg-white text-gray-800 rounded-xl min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Why Choose Us Section */}
      <motion.h1 
        className="text-5xl font-extrabold mb-6 text-green-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Why Choose Us?
      </motion.h1>

      <motion.p 
        className="text-lg mb-6 max-w-2xl text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        At <span className="font-semibold">Muthulakshmi Integrated Livestock Farm</span>, we are committed to excellence in livestock and farmfish, ensuring the highest quality through ethical and sustainable practices.
      </motion.p>

      <motion.div 
        className="mt-12 max-w-3xl text-left bg-white p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Our Commitments</h2>
        <motion.ul 
          className="space-y-6 text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.li 
            className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-300" 
            whileHover={{ scale: 1.05 }}
          >
            ✅ <span className="text-lg">Uncompromised Quality – We prioritize high-quality breeding and farming practices to ensure the best livestock and farm fish.</span>
          </motion.li>
          <motion.li 
            className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-300" 
            whileHover={{ scale: 1.05 }}
          >
            ✅ <span className="text-lg">Sustainable Farming – Our eco-friendly methods support long-term agricultural, livestock and aquaculture sustainability.</span>
          </motion.li>
          <motion.li 
            className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-300" 
            whileHover={{ scale: 1.05 }}
          >
            ✅ <span className="text-lg">Ethical Practices – We uphold humane animal care, ensuring proper nutrition, space, and health management.</span>
          </motion.li>
          <motion.li 
            className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-300" 
            whileHover={{ scale: 1.05 }}
          >
            ✅ <span className="text-lg">Customer Satisfaction – We are dedicated to providing the best products and services to our valued customers.</span>
          </motion.li>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}