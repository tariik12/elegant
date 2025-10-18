import { Link, useLocation } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import Container from "../Container/Container";
const Footer =()=>{

const location = useLocation();
const {pathname} = location;
    const footerLink = (
        <>
        
        <li><Link to='/blogs' className={`text-xl ${pathname === "/blogs"? "active":""}`}>Blogs</Link></li>
        <li>
        <Link to='/gallery' className={`text-xl ${pathname === "/gallery"? "active": ""}`}>Gallery</Link>
        </li>
        <li>
        <Link to='/reviews' className={`text-xl ${pathname === "/reviews"? "active": ""}`}>Reviews</Link>
        </li>
        <li>
        <Link to='/feedback' className={`text-xl ${pathname ==="/feedback"? "active":""}`}>Feedback</Link>
        </li>
        <li>
        <Link to='/legal' className={`text-xl ${pathname === "legal"? "active":""}`}>Legal</Link>
        </li>
     

       
        
  
        
        </>
    )
return(
    
    <div className="bg-black text-white py-10">
        <Container>

    <div>
    
        <div >
        <h3 className='text-4xl font-bold uppercase text-center text-white '> Elegant Idea & Technology Ltd </h3>
        </div>

<div className="flex justify-center items-center gap-10 text-4xl mt-8 ">
    <Link to='https://www.facebook.com/profile.php?id=100064711909380&_rdc=1&_rdr'><FaFacebook className="text-[#268EC1] font-thin hover:text-[#469dc9] cursor-pointer hover:shadow-xl" /></Link>

<FaInstagramSquare className="text-[#268EC1] font-thin hover:text-[#469dc9] cursor-pointer hover:shadow-xl" />
<FaYoutube  className="text-[#268EC1] font-thin hover:text-[#469dc9] cursor-pointer hover:shadow-xl"/>
</div>
<div className="text-center mt-5">
    <p>38, Sonargoan Janapath, SBDL Padma Nagar (7th Floor), Sector-11, Uttara, Dhaka-1230.</p>
    
<p className="mt-5"> Elegant Idea & Technology Ltd © 2020-2024</p>
</div>
    </div>
        </Container>
    </div>

)
}
export default Footer;