// Login.jsx
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineLockReset } from 'react-icons/md';
import { useAuth } from '../../Provider/AuthProvier';
import Swal from 'sweetalert2';
import { IoMdLogOut } from 'react-icons/io';
const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { login } = useAuth();
  const handleLogin = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/login`, {
        email: data.email,
        password: data.password,
      });

      if (response.data.message === 'Login Successfully') {
        console.log('Login successful');
        login('can-login');
        navigate('/admin-dashboard');
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Login Successful!",
          text: "You have successfully logged in.",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log('Invalid credentials');
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Invalid Credentials",
          text: response.data.error || "The email or password you entered is incorrect.",
          showConfirmButton: false,
          timer: 1500,
        });
        setFailedAttempts((prevAttempts) => prevAttempts + 1);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Invalid credentials');
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Invalid Credentials",
          text: "The email or password you entered is incorrect.",
          showConfirmButton: false,
          timer: 1500,
        });
        setFailedAttempts((prevAttempts) => prevAttempts + 1);
      } else {
         
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Error!",
          text: "An error occurred while trying to log in. Please try again later.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <div className='my-20'>
      <form className='flex flex-col items-center gap-10' onSubmit={handleSubmit((data) => handleLogin(data))}>
        <h3 className='text-center'>
          <span className='text-3xl font-thin uppercase'>Hey welcome to the <span className='text-[#268EC1]'> Elegant</span></span> <br />
          <span className='text-2xl font-thin uppercase'><span className='text-[#268EC1]'>Admin</span> Panel</span>
        </h3>
        <input className='border-2 w-1/3 rounded-md p-1 border-[#268EC1]' type='email' required placeholder='Provide Email' {...register('email')} />
        <input className='border-2 w-1/3 rounded-md p-1 border-[#268EC1]' type='password' required placeholder='Provide correct password' {...register('password')} />
       <div className='flex gap-3'>
       <button type='submit' disabled={failedAttempts >= 3} className='flex items-center gap-2 border text-[#8BC34A] p-1 hover:text-bold hover:text-white hover:bg-[#8BC34A] rounded-lg border-[#8BC34A]'>
          <MdOutlineLockReset className='text-4xl cursor-pointer rounded-md uppercase' /> Login
        </button>
        <Link to='/' className='flex items-center gap-2 border text-[#8BC34A] p-1 hover:text-bold hover:text-white hover:bg-[#8BC34A] rounded-lg border-[#8BC34A]'>
        Home <IoMdLogOut className='text-4xl cursor-pointer rounded-md uppercase' />
      </Link>
       </div>
        {failedAttempts >= 3 && <p className='text-red-500 font-bold'>You have exceeded the maximum login attempts. Please try again in 30 minutes.</p>}
      </form>
    </div>
  );
};

export default Login;
