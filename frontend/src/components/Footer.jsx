import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-sm text-gray-600 px-6 py-2 mt-10">
     
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 py-12">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Account</h4>
          <ul className="space-y-1">
            <li>Log In</li>
            <li>Sign Up</li>
            <li>Redeem a Gift Card</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Company</h4>
          <ul className="space-y-1">
            <li>About</li>
            <li>Environmental Initiatives</li>
            <li>Factories</li>
            <li>DEI</li>
            <li>Careers</li>
            <li>International</li>
            <li>Accessibility</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Get Help</h4>
          <ul className="space-y-1">
            <li>Help Center</li>
            <li>Return Policy</li>
            <li>Shipping Info</li>
            <li>Bulk Orders</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Connect</h4>
          <ul className="space-y-1">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>Twitter</li>
            <li>Affiliates</li>
            <li>Out Stores</li>
          </ul>
        </div>

        <div className="col-span-2">
          <h4 className="font-semibold text-gray-800 mb-3">Subscribe</h4>
          <form className="flex">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 rounded-r-md hover:bg-gray-800"
            >
              →
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto text-center text-xs text-gray-500 space-y-1">
        <div className="flex flex-wrap justify-center gap-4 pb-2">
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>Do Not Sell or Share My Personal Information</p>
          <p>CS Supply Chain Transparency</p>
          <p>Vendor Code of Conduct</p>
          <p>Sitemap Pages</p>
          <p>Sitemap Products</p>
        </div>
        <p>&copy; 2023 All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
