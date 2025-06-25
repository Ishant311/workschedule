import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { authUser } = useAuthStore(); 

  const navItems = ["Product", "Solutions", "Resources"];

  useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 100) {
      setShowNavbar(true); // Always show navbar at the top
    } else {
      setShowNavbar(currentScrollY < lastScrollY); // Show on scroll up
    }

    setLastScrollY(currentScrollY);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [lastScrollY]);


  return (
    <nav
      className={`bg-gradient-to-r from-indigo-800 to-purple-800 fixed top-0 left-0 w-full shadow-lg z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap justify-between items-center gap-4">
        <Link to="/" className="flex items-center">
          <Logo color="#ffffff" />
        </Link>

        <div className="hidden lg:flex flex-grow justify-around items-center">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                className="flex items-center gap-1 text-white hover:text-yellow-300 transition text-[16px] font-medium"
              >
                {item}
                <ChevronDown size={16} />
              </button>
            ))}
            <Link
              to="/pricing"
              className="text-white hover:text-yellow-300 text-[16px] font-medium"
            >
              Pricing
            </Link>
          </div>

          {!authUser && (
            <div className="flex items-center space-x-6">
              <Link
                to="/login"
                className="text-white hover:text-yellow-300 transition font-medium"
              >
                Log in
              </Link>
            </div>
          )}
        </div>

        <div className="lg:hidden ml-auto flex justify-center items-center gap-5">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-indigo-900 overflow-y-auto flex flex-col justify-between lg:hidden">
          <div className="flex items-center justify-between px-4 py-4 shadow-sm bg-indigo-800">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <Logo color="#ffffff" />
            </Link>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-col divide-y divide-indigo-700">
            {navItems.map((item) => (
              <button
                key={item}
                className="w-full text-left px-6 py-4 flex justify-between items-center text-lg font-semibold text-white"
              >
                {item}
                <ChevronRight size={18} className="text-yellow-300" />
              </button>
            ))}
            <Link
              to="/pricing"
              className="w-full text-left px-6 py-4 text-lg font-semibold text-white"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
          </div>

          {!authUser && (
            <div className="px-4 mt-6 pb-6">
              <Link
                to="/login"
                className="w-full block py-3 rounded-lg bg-yellow-300 text-indigo-900 font-bold text-center mb-3"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
