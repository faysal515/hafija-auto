import { useState } from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import ShippingTable from "../components/ShippingTable";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Top Header Section */}
      <div className="bg-gray-800 py-2">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="Company Logo"
              width={150}
              height={40}
              className="cursor-pointer -mt-4 w-32 md:w-auto"
            />
            <span className="text-xl md:text-2xl font-bold text-white">
              HAFIJA AUTO
            </span>
          </div>

          {/* Contact Info */}
          <div className="flex items-center text-white text-sm md:text-base">
            <svg
              className="w-4 h-4 md:w-5 md:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div>
              <div>Have any Question?</div>
              <div>+8801986106812</div>
            </div>
          </div>

          {/* Consultation Button */}
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 md:px-6 rounded text-sm md:text-base">
            FREE CONSULTATION
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-gray-700 py-3 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Hamburger Menu for Mobile */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            {/* Navigation Links */}
            <nav
              className={`${
                isMenuOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-full"
              } md:opacity-100 md:translate-y-0 transition-all duration-300 ease-in-out
              absolute md:relative top-full left-0 right-0 bg-gray-700 md:bg-transparent
              ${isMenuOpen ? "block" : "hidden"} md:block`}
            >
              <div className="flex flex-col md:flex-row md:space-x-8 items-center justify-center py-4 md:py-0 space-y-4 md:space-y-0 text-white text-sm md:text-base">
                <a
                  href="#home"
                  className="hover:text-yellow-400 w-full md:w-auto text-center"
                >
                  Home
                </a>
                <a
                  href="#about-us"
                  className="hover:text-yellow-400 w-full md:w-auto text-center"
                >
                  About Us
                </a>
                <a
                  href="#car-duties"
                  className="hover:text-yellow-400 w-full md:w-auto text-center"
                >
                  Car Duties
                </a>
                <a
                  href="#shipping-schedule"
                  className="hover:text-yellow-400 w-full md:w-auto text-center"
                >
                  Shipping Schedule
                </a>
                <a
                  href="#vehicle-stock"
                  className="hover:text-yellow-400 w-full md:w-auto text-center"
                >
                  Vehicle Stock
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4">Shipping Schedule</h2>
        <ShippingTable />
      </div>
    </main>
  );
}
