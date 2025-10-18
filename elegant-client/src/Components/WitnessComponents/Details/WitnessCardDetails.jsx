
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WitnessCardDetails = () => {
  const [witnessData, setWitnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_URL}/products`);
        const filteredData = data.find((witness) => witness.id == id);
        setWitnessData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!witnessData) {
    return <p>Data not found.</p>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    className: "md:mx-o mx-10",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
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
    <div className="mt-16 md:p-10 px-2 py-5 overflow-hidden">
      <Slider {...settings}>
       <div>
       <img
          className="md:h-[400px] h-[150px]  w-full"
          src={`${import.meta.env.VITE_URL}/images/${witnessData?.subImage1}`}
          alt=""
        />
       </div>
        <div>
        <img
          className="md:h-[400px] h-[150px]  w-full"
          src={`${import.meta.env.VITE_URL}/images/${witnessData?.subImage2}`}
          alt=""
        />
        </div>
        <div>
        <img
          className="md:h-[400px] h-[150px]  w-full"
          src={`${import.meta.env.VITE_URL}/images/${witnessData?.subImage3}`}
          alt=""
        />
        </div>
      </Slider>
       <div className="md:flex items-center gap-5 text-left mt-10">
        <img
          className="rounded-md md:w-[400px] md:h-[550px]"
          src={`${import.meta.env.VITE_URL}/images/${witnessData.mainImage}`}
          alt=""
        />
        <div className="w-full border-2 border-[#268EC1] md-mt-0 mt-5">
          <p className="border-2 border-[#268EC1] w-full py-4 font-bold ps-10">
            Name : {witnessData.name}
          </p>
          <p className="border-2 border-[#268EC1] w-full py-4 font-bold ps-10">Address : {witnessData.address}</p>
          <p className="border-2 border-[#268EC1] w-full py-4 font-bold ps-10"> Land Area :{witnessData.landArea}</p>
          <p className="border-2 border-[#268EC1] w-full py-4 font-bold ps-10"> No Fo Floors : {witnessData.noOfFloors}</p>
          <p className="border-2 border-[#268EC1] w-full py-4 font-bold ps-10">Apartment Floor : {witnessData.apartmentFloor}</p>
          <p className="border-2 border-[#268EC1] w-full py-4 font-bold ps-10">Apartment Size : {witnessData.apartmentSize}</p>
          <p className="border-2 border-[#268EC1] w-full py-4 font-bold ps-10">Bedroom : {witnessData.bedroom}</p>
          <p className="border-2 border-[#268EC1] w-full py-4 font-bold ps-10">Launch Date :  {witnessData.launchDate}</p>
          <p className="border-2 border-[#268EC1] w-full py-4 font-bold ps-10">Collection :  {witnessData.collection}</p>
          {/* Add other details similarly */}
        </div>
      </div>

    </div>
  );
};

export default WitnessCardDetails;
