import { Link } from "react-router-dom";
import Container from "../../Shared/Container/Container";

const AboutUs = () =>{

return(
   
        <div className="mt-20 ">
       <img className="w-full" src="https://www.balleballeproperties.com/wp-content/uploads/2023/06/Property-Dealers-in-Chandigarh.jpg" alt="" />

     
                
<Container>
<h2 className="text-lg mt-5  uppercase md:text-4xl font-thin text-[#268EC1] text-center">Welcome to ELEGANT IDEA & TECHNOLOGY LTD</h2>
<p className='mt-5 text-gray-500 text-xl  md:p-2  mx-auto italic'>At ELEGANT IDEA & TECHNOLOGY LTD, we envision real estate as more than transactions; it's about crafting spaces for memories, realizing dreams, and living life. Recognizing your unique journey, we're here to guide every step. Our commitment extends beyond houses; it's about fostering lifestyles, ensuring your home is a reflection of your aspirations. With a focus on personalized service, cutting-edge technology, and unwavering integrity, we strive to redefine your real estate experience. ELEGANT isn't just a name; it's a commitment to excellence, transforming your search for the perfect home into a seamless and enriching journey. Discover the elegance in every aspect of your real estate endeavors with us.
</p>

           
        <div  className="md:flex justify-evenly">
<div>
<h3 className='text-2xl font-thin uppercase text-[#268EC1] mt-5 text-right me-5'>Our Story</h3>
<p className='mt-5 text-gray-500 text-xl  md:p-2  mx-auto italic'>Established in 2020, ELEGANT IDEA & TECHNOLOGY LTD has been a cornerstone in the real estate industry, serving Gulshan, Dhaka and beyond. Our founder, Md. Manik, envisioned a real estate company that prioritizes integrity, personalized service, and a deep understanding of the local market.
</p>
</div>
<div>
<h3 className='text-2xl font-thin uppercase text-[#268EC1]  mt-5'>Our Mission</h3>
<p className='mt-5 text-gray-500 text-xl  md:p-2  mx-auto italic'>Our mission is to empower individuals and families to make informed and confident real estate decisions. Whether you're a first-time home buyer, seasoned investor, or looking to sell your property, we are dedicated to providing unparalleled service and expertise to meet your unique needs.
</p>
</div>
        </div>
</Container>

        {/* acordian */}
        <h3 className="uppercase text-center my-5 text-4xl text-[#268EC1]">Why Choose ELEGANT IDEA & TECHNOLOGY LTD?
</h3>
<div className=" bg-contain bg-no-repeat bg-center p-10 text-white " style={{backgroundImage:`url("https://img.lovepik.com/background/20211021/large/lovepik-black-gold-poster-for-real-estate-background-image_400271379.jpg")`, backgroundSize:'100%'}}>
<div className="md:w-1/2 mx-auto">
            <div className="collapse collapse-plus ">
  <input type="radio" name="my-accordion-3" checked="checked" /> 
  <div className="collapse-title text-xl font-medium">
  Expertise:
  </div>
  <div className="collapse-content"> 
    <p>Our team consists of experienced real estate professionals who are passionate about helping you achieve your goals. We stay ahead of market trends and leverage our knowledge to your advantage.</p>
  </div>
</div>
<div className="collapse collapse-plus ">
  <input type="radio" name="my-accordion-3" /> 
  <div className="collapse-title text-xl font-medium">
  Personalized Service:
  </div>
  <div className="collapse-content"> 
    <p>We recognize that every client is unique. Our personalized approach ensures that you receive tailored solutions and attention throughout your real estate journey.</p>
  </div>
</div>
<div className="collapse collapse-plus ">
  <input type="radio" name="my-accordion-3" /> 
  <div className="collapse-title text-xl font-medium">
  Transparency:
  </div>
  <div className="collapse-content"> 
    <p>We believe in transparent communication and honesty. You can trust us to provide clear and comprehensive information, allowing you to make well-informed decisions.</p>
  </div>
</div>
<div className="collapse collapse-plus ">
  <input type="radio" name="my-accordion-3" /> 
  <div className="collapse-title text-xl font-medium">
  Community Commitment:
  </div>
  <div className="collapse-content"> 
    <p>ELEGANT is not just a real estate agency; we are an integral part of the community. We are committed to giving back and contributing to the well-being of the neighborhoods we serve.</p>
  </div>
</div>


</div>
</div>

<div className='md:w-9/12 mx-auto'>
    <p className="mt-5 text-gray-500 text-xl  md:p-2  mx-auto italic">
    Thank you for considering ELEGANT for your real estate needs. We look forward to being a part of your journey toward finding the perfect place to call home.

    </p>

   <p className="mt-5 text-gray-500 text-xl  md:p-2  text-center italic"> Ready to get started? <Link to='/contact-us' className="text-[#268EC1]">Contact us</Link> today!</p>
</div>
    </div>
 
)

}

export default AboutUs;