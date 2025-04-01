import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Products from '../components/Products';
import HomeComponent from '../components/HomeComponent';
import AuthPage from '../components/AuthPage';
import { Gallery } from '../components/Gallery';
import { Contact } from '../components/Contact';
import AboutUs from '../components/AbourtUS';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
    const components = [
        <HomeComponent/>,
        <AboutUs/>,
        <Products/>,
        <Gallery/>,
        <WhyChooseUs/>,
        <Contact/>,
        <AuthPage/>
    ]
    const [currentPage, setCurrentPage] = useState(0);

    const setCurrentPageIndex = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className="h-screen bg-gray-100">
            <Navbar setCurrentPage={setCurrentPageIndex} />
            {components[currentPage]}
        </div>
    );
};

export default Home;
