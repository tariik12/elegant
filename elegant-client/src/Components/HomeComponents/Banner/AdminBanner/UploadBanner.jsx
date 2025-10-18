import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUpload } from "react-icons/fa";
import { useQueryClient } from "react-query";
const UploadBanner = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const handleUpload = async (data) => {
    const formData = new FormData();
    formData.append("bannerImage", data.file[0]);
    formData.append("title", data.title);

    try {
      await axios.post(`${import.meta.env.VITE_URL}/bannerUpload`, formData);
      
      // Invalidate the "banners" query to trigger a refetch
      queryClient.invalidateQueries("banners");

      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Banner uploaded successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
    } catch (error) {
      console.error("Error uploading banner:", error);
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Error Uploading Banner",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="mt-5 mx-auto">
      <form
        className="flex justify-evenly items-center py-5"
        onSubmit={handleSubmit(handleUpload)}
      >
        <input className="border" type="file" {...register("file")} required />
        <input
          className="p-2 h-8 border"
          type="text"
          placeholder="Enter title"
          {...register("title")}
          required
        />
        <button
          className="text-4xl text-[#8BC34A] cursor-pointer hover:text-bold p-1 hover:bg-[#8BC34A] border border-[#8BC34A] hover:text-white rounded-md"
          title="Click For approved"
          type="submit"
        >
          <FaUpload />
        </button>
      </form>
    </div>
  );
};

export default UploadBanner;
