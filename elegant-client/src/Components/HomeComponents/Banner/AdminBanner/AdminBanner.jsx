import UploadBanner from "./UploadBanner";
import { Link } from "react-router-dom";
import TableHead from "./TableHead";
import DeleteBanner from "./DeleteBanner";
import { GrDocumentUpdate } from "react-icons/gr";
import { useQuery } from "react-query";
import axios from "axios";


const AdminBanner = () => {
  const { data: banners } = useQuery("banners", async () => {
    const response = await axios.get(`${import.meta.env.VITE_URL}/getAllData`);
    return response.data;
  });

  return (
    <div className="mt-16">
      <h3 className="text-center uppercase">Admin Banner</h3>
      <UploadBanner></UploadBanner>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <TableHead></TableHead>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {banners?.map((banner) => (
            <tr key={banner.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-xs font-thin text-gray-900">{banner.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-xs font-thin text-gray-900">{banner.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  className="h-10 w-10 rounded-md"
                  src={`${import.meta.env.VITE_URL}/images/${banner.bannerImage}`}
                  alt={`Image for ${banner.title}`}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link to={`/update/${banner.id}`}>
                  <GrDocumentUpdate
                    className="text-4xl text-[#8BC34A] cursor-pointer hover:text-bold p-1 hover:bg-[#8BC34A] border border-[#8BC34A] hover:text-white rounded-md"
                    title="Click For approved"
                  />
                </Link>
              </td>
              <DeleteBanner banner={banner}></DeleteBanner>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBanner;
