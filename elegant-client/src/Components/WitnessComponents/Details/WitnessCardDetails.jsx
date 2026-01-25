
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const InfoItem = ({ label, value }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/10">
      <p className="text-xl text-white/60">{label}</p>
      <p className="text-xl text-white font-semibold text-right">{value}</p>
    </div>
  );
};

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
                    className="h-[180px] sm:h-[320px] lg:h-[420px] w-full object-cover"
                    src={`${import.meta.env.VITE_URL}/images/${witnessData?.subImage1}`}
                    alt={`Project imaggw`}
                  />
       </div>
        <div>
          <img
                    className="h-[180px] sm:h-[320px] lg:h-[420px] w-full object-cover"
                    src={`${import.meta.env.VITE_URL}/images/${witnessData?.subImage2}`}
                    alt={`Project imaggw`}
                  />
        </div>
        <div>
    <img
                    className="h-[180px] sm:h-[320px] lg:h-[420px] w-full object-cover"
                    src={`${import.meta.env.VITE_URL}/images/${witnessData?.subImage3}`}
                    alt={`Project imaggw`}
                  />
        </div>
      </Slider>
       <div className="md:flex items-center gap-5 text-left mt-10">
        <img
          className="rounded-md md:w-[400px] md:h-[550px]"
          src={`${import.meta.env.VITE_URL}/images/${witnessData.mainImage}`}
          alt=""
        />
    
         {/* Right Details */}
        <div className="w-full  rounded rounded-md border-2 border-[#268EC1] md-mt-0 mt-5">
    
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base sm:text-lg font-bold text-white">Project Information</h3>
                {witnessData?.launchDate && (
                  <div className="text-right">
                    <p className="text-[11px] text-white/60">Launch Date</p>
                    <p className="text-sm font-semibold text-white">{witnessData.launchDate}</p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <InfoItem label="Name" value={witnessData?.name} />
                <InfoItem label="Address" value={witnessData?.address} />
                <InfoItem label="Land Area" value={witnessData?.landArea} />
                <InfoItem label="No of Floors" value={witnessData?.noOfFloors} />
                <InfoItem label="Apartment Floor" value={witnessData?.apartmentFloor} />
                <InfoItem label="Apartment Size" value={witnessData?.apartmentSize} />
                <InfoItem label="Bedroom" value={witnessData?.bedroom} />
                <InfoItem label="Bathroom" value={witnessData?.bathroom} />
                <InfoItem label="Collection" value={witnessData?.collection} />
                <InfoItem label="Extra Info" value={witnessData?.extraData} />
              </div>
 <div className="mt-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 ring-1 ring-white/10 p-5 sm:p-6">
              <h4 className="text-sm font-bold text-white">Summary</h4>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                <span className="font-semibold text-white">{witnessData?.name}</span> is a{" "}
                <span className="font-semibold text-white">{witnessData?.status}</span> project located in{" "}
                <span className="font-semibold text-white">{witnessData?.address}</span>. It offers apartment sizes{" "}
                <span className="font-semibold text-white">{witnessData?.apartmentSize || "-"}</span>, with{" "}
                <span className="font-semibold text-white">{witnessData?.bedroom || "-"}</span> bedrooms and{" "}
                <span className="font-semibold text-white">{witnessData?.bathroom || "-"}</span> bathrooms.
              </p>
            </div>
      </div>
</div>
</div>
    </div>
  );
};

export default WitnessCardDetails;
