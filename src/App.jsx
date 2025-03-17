import React, { useState } from 'react';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import AdminPage from './pages/Admin';
import UserPage from './pages/User';

export default function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />       
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage userPhone={"9884642773"}/>} />
      </Routes>
    </div>
  );
}
