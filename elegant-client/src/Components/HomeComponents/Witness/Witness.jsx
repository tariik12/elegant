

import { useEffect, useState } from "react";
import Container from "../../../Shared/Container/Container";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

const Witness = () => {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [witnessData, setWitnessData] = useState([]);

  const { data: witness } = useQuery("products", async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_URL}/products`);
    return data; // Fix the typo here
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_URL}/witness`);
        setWitnessData(data);
      } catch (error) {
        console.error("Error fetching witness data:", error);
      }
    };
    fetchData();
  }, [import.meta.env.VITE_URL]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    className: "mx-8",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Container>
      {witnessData.map(({ id, witnessTitle, witnessPara }) => (
        <div key={id} className="my-10">
          <h1 className="text-lg md:text-4xl font-thin text-[#268EC1] text-center">{witnessTitle}</h1>
          <p className="mt-5 text-gray-500 text-xl md:p-2 md:w-9/12 mx-auto italic">{witnessPara}</p>
        </div>
      ))}

      {witness && witness.length > 0 && ( 
        <Slider {...settings}>
          {witness.map(({ id, name, mainImage, address, status }) => (
            <div
              className="mx-auto mar relative overflow-hidden"
              onMouseEnter={() => setHoveredImage(id)}
              key={id}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <Link to={`/details/${id}`}>
                <img
                  className={`h-[400px] w-full delay-75 transition-transform transform ${
                    hoveredImage === id ? "hover:scale-105" : "scale-100"
                  }`}
                  src={`${import.meta.env.VITE_URL}/images/${mainImage}`}
                  alt={name}
                  title="Click here"
                />
              </Link>

              <div className="flex justify-between items-center mt-3">
                <div>
                  <h4 className="text-xl text-[#268EC1]">{name}</h4>
                  <h5 className="text-gray-500">Address : {address}</h5>
                  <h5 className="text-gray-500">Status : {status}</h5>
                </div>
                <Link to='/contact-us' className="px-4 shadow-2xl shadow-[#469dc9] rounded-full border-2 hover:border-4 border-[#268EC1] bg-[#268EC1] hover:bg-[#469dc9] uppercase text-white">
                  Contact
                </Link >
              </div>
            </div>
          ))}
        </Slider>
      )}
    </Container>
  );
};

export default Witness;
