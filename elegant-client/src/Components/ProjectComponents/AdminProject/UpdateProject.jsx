import axios from "axios";
import { useForm } from "react-hook-form";
import { GrDocumentUpdate } from "react-icons/gr";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UpdateProject = () => {
  const product = useLoaderData();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const handleUpdate = async (data, productIdToUpdate) => {
    const formData = new FormData();

    // Text fields (only send if user typed something)
    if (data.newName) formData.append("name", data.newName);
    if (data.newAddress) formData.append("address", data.newAddress);
    if (data.newStatus) formData.append("status", data.newStatus);
    if (data.newLandArea) formData.append("landArea", data.newLandArea);
    if (data.newNoOfFloors) formData.append("noOfFloors", data.newNoOfFloors);
    if (data.newApartmentFloor) formData.append("apartmentFloor", data.newApartmentFloor);
    if (data.newApartmentSize) formData.append("apartmentSize", data.newApartmentSize);
    if (data.newBedroom) formData.append("bedroom", data.newBedroom);
    if (data.newBathroom) formData.append("bathroom", data.newBathroom);
    if (data.newLaunchDate) formData.append("launchDate", data.newLaunchDate);
    if (data.newCollection) formData.append("collection", data.newCollection);
    if (data.newExtraData) formData.append("extraData", data.newExtraData);

    // Files (only if selected)
    if (data.newMainImage?.[0]) formData.append("mainImage", data.newMainImage[0]);
    if (data.newSubImage1?.[0]) formData.append("subImage1", data.newSubImage1[0]);
    if (data.newSubImage2?.[0]) formData.append("subImage2", data.newSubImage2[0]);
    if (data.newSubImage3?.[0]) formData.append("subImage3", data.newSubImage3[0]);

    try {
      await axios.patch(`${import.meta.env.VITE_URL}/updateProduct/${productIdToUpdate}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Project updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      reset();
      navigate("/admin-dashboard");
    } catch (error) {
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Error updating project",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-10 px-4">
      <div className=" rounded-2xl shadow p-6">
        <h3 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          Admin Project Update
        </h3>

        {/* current preview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl overflow-hidden border">
            <img
              className="w-full h-56 object-cover"
              src={`${import.meta.env.VITE_URL}/images/${product?.mainImage}`}
              alt="Current Main"
            />
          </div>
          <div className="border rounded-xl p-4 text-sm space-y-2">
            <p><span className="font-semibold">Name:</span> {product?.name}</p>
            <p><span className="font-semibold">Status:</span> {product?.status}</p>
            <p><span className="font-semibold">Land Area:</span> {product?.landArea}</p>
            <p><span className="font-semibold">Launch Date:</span> {product?.launchDate}</p>
            <p className="text-gray-500">Update only what you need. Blank fields won’t be sent.</p>
          </div>
        </div>

        <form
          className="grid md:grid-cols-2 gap-5"
          onSubmit={handleSubmit((data) => handleUpdate(data, product.id))}
          encType="multipart/form-data"
        >
          {/* inputs helper */}
          {[
            ["Name", "newName", "text", "e.g. Elegant Sky View"],
            ["Address", "newAddress", "text", "e.g. Mohammadpur"],
            ["Land Area", "newLandArea", "text", "e.g. 5 kata"],
            ["No of Floors", "newNoOfFloors", "text", "e.g. 10"],
            ["Apartment Floor", "newApartmentFloor", "text", "e.g. 18"],
            ["Apartment Size", "newApartmentSize", "text", "e.g. 1500-3000 Sft"],
            ["Bedroom", "newBedroom", "text", "e.g. 3"],
            ["Bathroom", "newBathroom", "text", "e.g. 4"],
            ["Launch Date", "newLaunchDate", "date", ""],
            ["Collection", "newCollection", "text", "e.g. ok"],
            ["Extra Data", "newExtraData", "text", "e.g. 01-04-26"],
          ].map(([label, name, type, placeholder]) => (
            <div key={name} className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase text-slate-600">
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                {...register(name)}
              />
            </div>
          ))}

          {/* status dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-slate-600">Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
              defaultValue=""
              {...register("newStatus")}
            >
              <option value="" disabled>Choose status</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* images */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-slate-600">Main Image</label>
            <input className="w-full border rounded-lg px-3 py-2" type="file" accept="image/*" {...register("newMainImage")} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-slate-600">Sub Image 1</label>
            <input className="w-full border rounded-lg px-3 py-2" type="file" accept="image/*" {...register("newSubImage1")} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-slate-600">Sub Image 2</label>
            <input className="w-full border rounded-lg px-3 py-2" type="file" accept="image/*" {...register("newSubImage2")} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase text-slate-600">Sub Image 3</label>
            <input className="w-full border rounded-lg px-3 py-2" type="file" accept="image/*" {...register("newSubImage3")} />
          </div>

          {/* submit */}
          <div className="md:col-span-2 flex justify-center pt-3">
            <button type="submit" className="flex items-center gap-3 bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 transition">
              <GrDocumentUpdate className="text-xl" />
              <span className="font-semibold">Update Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProject;
