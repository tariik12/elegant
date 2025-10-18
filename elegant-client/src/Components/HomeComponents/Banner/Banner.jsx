import { useState } from "react";
import bannerVideo from "/eleg.mp4";
import axios from "axios";
import { useQuery } from "react-query";

const Banner = () => {
  const { data: banners } = useQuery("banners", async () => {
    const response = await axios.get(`${import.meta.env.VITE_URL}/getAllData`);
    return response.data;
  });

  const [hoveredImage, setHoveredImage] = useState(null);

  return (
    <div className="relative w-full h-[300px] md:h-auto md:w-full">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        muted
        loop
        autoPlay
        src={bannerVideo}
      ></video>

      <div className="hidden md:block">
        <div className="flex justify-end">
          {banners?.map(({ bannerImage, id, title }) => (
            <div
              key={id}
              className="relative overflow-hidden hover:w-full w-[100px] z-10 bg-cover border-x-2 bg-bottom border-orange-50 flex justify-center items-end"
              onMouseEnter={() => setHoveredImage(id)}
              onMouseLeave={() => setHoveredImage(null)}
              style={{
                backgroundImage: `url('${import.meta.env.VITE_URL}/images/${bannerImage}')`,
                paddingBottom: "45.666%",
              }}
            >
              {hoveredImage === id && (
                <div className="absolute bottom-0 text-white bg-[#2e89e4b2] text-3xl font-thin text-center w-1/2 p-4 rounded-t-full italic">
                  <p>{title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;


