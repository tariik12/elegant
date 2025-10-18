import React from 'react';


const ContactUs = () => {
  return (
    <div>
     
        <h2 className="text-4xl font-thin mt-20">CONTACT US</h2>
        <div className="">
        <div className="w-full mx-auto my-8">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2733.1657406166755!2d90.39873337322784!3d23.877608733997707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c439a67d0b0d%3A0xb9ec7d3de58f2eaf!2sSBDL!5e0!3m2!1sen!2sbd!4v1709814048892!5m2!1sen!2sbd"
              width="100%"
              height="450"
              style={{ border: '0' }} // Use a JavaScript object for styling
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
          </div>
          <div className=" p-5 md:w-1/2 mx-auto pt-10">
            <h3 className="text-4xl font-thin uppercase text-[#268EC1] "> Elegant Idea & Technology Ltd </h3>
            <p>
            38, Sonargoan Janapath, SBDL Padma Nagar (7th Floor), <br /> Sector-11, Uttara, Dhaka-1230.
            </p>
            <p className="my-3">
              <strong>Cell:</strong> +880 1792-886466
            </p>
            <p>
              <strong>Email:</strong> info.elegant.bd@gmail.com
            </p>
          </div>
          {/* Add Static Google Maps Iframe */}
          
        </div>
      
    </div>
  );
};

export default ContactUs;
