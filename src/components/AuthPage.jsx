import React, { useState } from "react";
import { ref, set, get, child } from "firebase/database";
import { db } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const addUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!phone || !password || (!isLogin && !name)) {
      toast.info("Please fill all the details!");
      setLoading(false);
      return;
    }

    const dbRef = ref(db);

    try {
      const snapshot = await get(child(dbRef, `users/${phone}`));
      if (snapshot.exists()) {
        if (isLogin) {
          const userData = snapshot.val();
          if (userData.password === password) {
            toast.success("Login successful!");
          } else {
            toast.error("Invalid phone number or password!");
          }
        } else {
          toast.info("User already exists!");
        }
      } else {
        if (isLogin) {
          toast.error("Invalid phone number or password!");
        } else {
          await set(ref(db, `users/${phone}`), {
            name,
            phone,
            password,
          });
          toast.success("Account created successfully!");
          setIsLogin(true);
          setName("");
          setPhone("");
          setPassword("");
        }
      }
    } catch (error) {
      console.error("Error adding user: ", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen flex flex-col items-center justify-center overflow-y-auto">
      <ToastContainer/>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={addUser}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className={`w-full p-3 rounded-lg transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
            disabled={loading}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline ml-1"
            disabled={loading}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
