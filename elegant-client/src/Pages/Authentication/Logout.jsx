// Logout.jsx
import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvier';
import Swal from 'sweetalert2';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { IoMdLogOut } from 'react-icons/io';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      await logout('login-page');
    }
  };

  const handleLoginLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      await logout('home-page');
    }
  };

  return (
    <div className='flex items-center gap-5 justify-center py-5'>
      <button onClick={handleLogout} className='flex items-center gap-2 border text-red-500 p-1 hover:text-bold hover:text-white hover:bg-red-500 rounded-lg border-red-500'>
        <RiLogoutCircleLine className='text-4xl cursor-pointer rounded-md uppercase' /> Logout
      </button>
      <Link onClick={handleLoginLogout} className='flex items-center gap-2 border text-[#8BC34A] p-1 hover:text-bold hover:text-white hover:bg-[#8BC34A] rounded-lg border-[#8BC34A]'>
        Home <IoMdLogOut className='text-4xl cursor-pointer rounded-md uppercase' />
      </Link>
    </div>
  );
};

export default Logout;
