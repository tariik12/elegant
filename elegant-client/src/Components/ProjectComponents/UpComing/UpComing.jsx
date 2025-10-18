import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

const UpComing = () => {
  const [hoveredConstructionId, setHoveredConstructionId] = useState(null);

  const { data: constructionDatas } = useQuery("products", async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_URL}/products`);
    return data;
  });

  const upComingConstructionData = constructionDatas
    ? constructionDatas.filter(({ status }) => status === "On Going")
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-20">
      {upComingConstructionData.map(({ id, name, mainImage, address }) => (
        <div
          key={id}
          className="mx-auto mar relative overflow-hidden"
          onMouseEnter={() => setHoveredConstructionId(id)}
          onMouseLeave={() => setHoveredConstructionId(null)}
        >
          <Link to={`/details/${id}`}>
            <img
              className={`h-[400px] w-full delay-75 transition-transform transform ${
                hoveredConstructionId === id ? "hover:scale-105" : "scale-100"
              }`}
              src={`${import.meta.env.VITE_URL}/images/${mainImage}`}
                  alt={name}
              title="Click here"
            />
          </Link>

          <div className="flex justify-between items-center mt-3">
            <div>
              <h4 className="text-xl text-[#268EC1]">{name}</h4>
              <h5 className="text-gray-500">{address}</h5>
            </div>
            <Link
              to="/contact-us"
              className="px-4 shadow-2xl shadow-[#469dc9] rounded-full border-2 hover:border-4 border-[#268EC1] bg-[#268EC1] hover:bg-[#469dc9] uppercase text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpComing;
