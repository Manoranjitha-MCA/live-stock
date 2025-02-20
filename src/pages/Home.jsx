import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Products from '../components/Products';
import HomeComponent from '../components/HomeComponent';
import AuthPage from '../components/AuthPage';

const Home = () => {
    const components = [
        <HomeComponent/>,
        <Products/>,
        <AuthPage/>
    ]
    const [currentPage, setCurrentPage] = useState(0);

    const setCurrentPageIndex = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className="h-screen bg-gray-100 overflow-hidden">
            <Navbar setCurrentPage={setCurrentPageIndex} />
            {components[currentPage]}
        </div>
    );
};

export default Home;
