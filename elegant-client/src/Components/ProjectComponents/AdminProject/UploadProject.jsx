import { useForm } from "react-hook-form";
import { GrDocumentUpdate } from "react-icons/gr";
import axios from "axios";
import Swal from "sweetalert2";
import { useQueryClient } from "react-query";

const UploadProject = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const handleUpload = async (data) => {
    const formData = new FormData();

    // Text fields - append only if user typed/selects value
    if (data.name) formData.append("name", data.name);
    if (data.address) formData.append("address", data.address);
    if (data.status) formData.append("status", data.status);
    if (data.landArea) formData.append("landArea", data.landArea);
    if (data.noOfFloors) formData.append("noOfFloors", data.noOfFloors);
    if (data.apartmentFloor) formData.append("apartmentFloor", data.apartmentFloor);
    if (data.apartmentSize) formData.append("apartmentSize", data.apartmentSize);
    if (data.bedroom) formData.append("bedroom", data.bedroom);
    if (data.bathroom) formData.append("bathroom", data.bathroom);
    if (data.launchDate) formData.append("launchDate", data.launchDate);
    if (data.collection) formData.append("collection", data.collection);
    if (data.extraData) formData.append("extraData", data.extraData);

    // Images - append only if selected
    if (data.mainImage?.[0]) formData.append("mainImage", data.mainImage[0]);
    if (data.subImage1?.[0]) formData.append("subImage1", data.subImage1[0]);
    if (data.subImage2?.[0]) formData.append("subImage2", data.subImage2[0]);
    if (data.subImage3?.[0]) formData.append("subImage3", data.subImage3[0]);

    try {
      await axios.post(`${import.meta.env.VITE_URL}/projectUpload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      queryClient.invalidateQueries("products");

      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Project uploaded successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      reset();
    } catch (error) {
      console.error("Error uploading project:", error);

      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Error Uploading Project",
        text: error?.response?.data?.error || "Something went wrong",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="my-16">
      <h3 className="text-3xl font-thin text-center mb-10">
        Admin Upload Project
      </h3>

      <form
        className="flex flex-col items-center gap-5"
        onSubmit={handleSubmit(handleUpload)}
        encType="multipart/form-data"
      >
        <label className="text-bold uppercase text-[#268EC1]" htmlFor="name">
          Name
        </label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="Name"
          {...register("name")}
        />

        <label className="text-bold uppercase text-[#268EC1]" htmlFor="address">
          Address
        </label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="Address"
          {...register("address")}
        />

        <label className="text-bold uppercase text-[#268EC1]" htmlFor="status">
          Status
        </label>
        <select
          className="w-1/2 border-2 p-2 rounded-md border-black"
          defaultValue=""
          {...register("status")}
        >
          <option value="">Choose status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
        </select>

        <label className="text-bold uppercase text-[#268EC1]">Land Area</label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="Land Area"
          {...register("landArea")}
        />

        <label className="text-bold uppercase text-[#268EC1]">
          No of Floors
        </label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="No of Floors"
          {...register("noOfFloors")}
        />

        <label className="text-bold uppercase text-[#268EC1]">
          Apartment Floor
        </label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="Apartment Floor"
          {...register("apartmentFloor")}
        />

        <label className="text-bold uppercase text-[#268EC1]">
          Apartment Size
        </label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="Apartment Size"
          {...register("apartmentSize")}
        />

        <label className="text-bold uppercase text-[#268EC1]">Bedroom</label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="Bedroom"
          {...register("bedroom")}
        />

        <label className="text-bold uppercase text-[#268EC1]">Bathroom</label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="Bathroom"
          {...register("bathroom")}
        />

        <label className="text-bold uppercase text-[#268EC1]">
          Launch Date
        </label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="date"
          {...register("launchDate")}
        />

        <label className="text-bold uppercase text-[#268EC1]">Collection</label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="Collection"
          {...register("collection")}
        />

        <label className="text-bold uppercase text-[#268EC1]">Extra Data</label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="text"
          placeholder="Extra Data"
          {...register("extraData")}
        />

        <label className="text-bold uppercase text-[#268EC1]">Main Image</label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="file"
          accept="image/*"
          {...register("mainImage")}
        />

        <label className="text-bold uppercase text-[#268EC1]">
          Sub Image 1
        </label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="file"
          accept="image/*"
          {...register("subImage1")}
        />

        <label className="text-bold uppercase text-[#268EC1]">
          Sub Image 2
        </label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="file"
          accept="image/*"
          {...register("subImage2")}
        />

        <label className="text-bold uppercase text-[#268EC1]">
          Sub Image 3
        </label>
        <input
          className="w-1/2 border-2 p-1 rounded-md border-black"
          type="file"
          accept="image/*"
          {...register("subImage3")}
        />

        <button type="submit">
          <GrDocumentUpdate
            className="text-4xl text-[#8BC34A] cursor-pointer p-1 hover:bg-[#8BC34A] border border-[#8BC34A] hover:text-white rounded-md"
            title="Upload Project"
          />
        </button>
      </form>
    </div>
  );
};

export default UploadProject;