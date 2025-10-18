import { Link, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useState } from "react";

const NavigationItem = () => {
  const location = useLocation();
  const { pathname } = location;

  const navLinks = (
    <>
      <Link
        className={`text-xl ${pathname === "/" ? "active " : ""}`}
        to="/"
      >
        Home
      </Link>
      <div className="relative group  ">
<div className="cursor-pointer text-xl">Projects</div>
      <div className="dropdown-content absolute z-10 bg-transparent hidden group-hover:block shadow-md ">
     <div className='flex flex-col py-7 '>
     <Link
        className={`text-xl bg-[#0f10118a] px-3 ${pathname === "/projects" ? "active" : " "}`}
        to="/on-going"
      >
        On Going
      </Link>
      <Link
        className={`text-xl bg-[#0f10118a]  px-3 ${pathname === "/projects" ? "active" : ""}`}
        to="/up-coming"
      >
       Up Coming  
      </Link>
      <Link
        className={`text-xl  bg-[#0f10118a] px-3 pb-4 ${pathname === "/projects" ? "active" : ""}`}
        to="/completed"
      >
        Completed
      </Link>
     </div>
      </div>
      </div>
      <Link
        className={`text-xl ${
          pathname === "/construction-status" ? "active" : ""
        }`}
        to="/construction-status"
      >
        Construction Status
      </Link>
      <Link
        className={`text-xl ${pathname === "/about-us" ? "active" : ""}`}
        to="/about-us"
      >
        About Us
      </Link>
      <Link
        className={`text-xl ${pathname === "/contact-us" ? "active" : ""}`}
        to="/contact-us"
      >
        Contact Us
      </Link>
    </>
  );

  const [navOpen, setOpen] = useState(false);

  const openMenu = () => {
    setOpen(!navOpen);
  };

  return (
    <div className="md:flex md:justify-between md:items-center uppercase me-6">
      {/* Desktop Navbar */}
      <div className="hidden md:flex gap-6">{navLinks}</div>

      {/* Mobile Navbar */}
      <div className="md:hidden relative">
        <IoMenu className="text-4xl mt-4 ms-5" onClick={openMenu} />
        {navOpen && (
          <div className="flex flex-col justify-center mt-7 py-7 px-[74.5px] bg-black text-white absolute uppercase">
            {navLinks}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationItem;
