import { motion } from 'framer-motion';

export default function AboutUs() {
  return (
    <motion.div 
      className="flex flex-col justify-center items-center text-center p-8 bg-white text-gray-800 rounded-xl min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* About Us Section */}
      <motion.h1 
        className="text-5xl font-extrabold mb-6 text-green-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        About Us
      </motion.h1>

      <motion.p 
        className="text-lg mb-6 max-w-2xl text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Welcome to <span className="font-semibold">Muthulakshmi Integrated Livestock Farm</span>, where tradition meets innovation in sustainable farming. We take pride in producing high-quality livestock and farm fish, ensuring freshness, nutrition, and ethical farming practices at every step. Our farm is committed to deliver excellence while maintaining harmony with nature.
      </motion.p>

      {/* Who We Are Section */}
      <motion.div 
        className="bg-gray-100 p-6 rounded-xl shadow-md max-w-3xl text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-2xl font-bold text-green-700 mb-4">Who We Are</h2>
        <p className="text-gray-700">
          At <span className="font-semibold">Muthulakshmi Integrated Livestock Farm</span>, we are passionate about sustainable agriculture, livestock and aquaculture. Our mission is to provide premium-quality livestock and farm fish while promoting eco-friendly and ethical farming practices. We believe that responsible farming not only benefits our customers but also supports a healthier environment.
        </p>
      </motion.div>
    </motion.div>
  );
}
