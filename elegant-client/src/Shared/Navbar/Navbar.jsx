import { useEffect, useState } from "react";
import NavigateItem from "../../Components/NavbarComponent/NavigateItem";
import Container from "../Container/Container";
import { Link } from "react-router-dom";
import logo from '../../assets/elegant-logo.png'
const Navbar =() =>{
    const [navOpen, setOpen] = useState(false);
const [scrolling, setScrolling] = useState(false);
    const openMenu = () => {
      setOpen(!navOpen);
    };

    useEffect (() =>{
        const handleScroll =() =>{

            if(window.scrollY >0){

                setScrolling(true);
            }
            else {
                setScrolling(false);
        } 
        };
        window.addEventListener('scroll', handleScroll);

        return () =>{
            window.removeEventListener('scroll', handleScroll)
        }
    },[])
 return(

    <div className={` text-white fixed w-full top-0 z-50 ${scrolling? 'bg-[#0f10118a]':' bg-[#0f10118a]'}`} >
        <Container>

        <div className=" flex flex-row-reverse  md:flex-row justify-between items-start md:items-center ">
            {/* logo */}
            <Link to='/'>

            <img className="w-20 h-20  rounded-full p-1" src={logo} alt="" />
            </Link>
            {/* navigate var */}

            <NavigateItem openMenu={openMenu} navOpen={navOpen}></NavigateItem>

        </div>
        </Container>
    </div>
 )
}

export default Navbar;