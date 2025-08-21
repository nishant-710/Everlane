import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar1 from './Navbar1.jsx';
import Footer from "./Footer.jsx"


const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar1/>
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;
