import axios from "axios";
import { useForm } from "react-hook-form";
import { GrDocumentUpdate } from "react-icons/gr";
import { useLoaderData, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UpdateProject = () => {
  const product = useLoaderData();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  const handleUpdate = async (data) => {
    const formData = new FormData();

    formData.append("name", data.newName);
    formData.append("address", data.newAddress);
    formData.append("status", data.newStatus);
    formData.append("landArea", data.newLandArea);
    formData.append("noOfFloors", data.newNoOfFloors);
    formData.append("apartmentFloor", data.newApartmentFloor);
    formData.append("apartmentSize", data.newApartmentSize);
    formData.append("bedroom", data.newBedroom);
    formData.append("bathroom", data.newBathroom);
    formData.append("launchDate", data.newLaunchDate);
    formData.append("collection", data.newCollection);
    formData.append("extraData", data.newExtraData);

    if (data.newMainImage?.[0]) {
      formData.append("mainImage", data.newMainImage[0]);
    }

    if (data.newSubImage1?.[0]) {
      formData.append("subImage1", data.newSubImage1[0]);
    }

    if (data.newSubImage2?.[0]) {
      formData.append("subImage2", data.newSubImage2[0]);
    }

    if (data.newSubImage3?.[0]) {
      formData.append("subImage3", data.newSubImage3[0]);
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_URL}/updateProduct/${product.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      console.error("Update error:", error);

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
      <div className="rounded-2xl shadow p-6">
        <h3 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          Admin Project Update
        </h3>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl overflow-hidden border">
            <img
              className="w-full h-56 object-cover"
              src={`${import.meta.env.VITE_URL}/images/${product?.mainImage}`}
              alt="Current Main"
            />
          </div>

          <div className="border rounded-xl p-4 text-sm space-y-2">
            <p>
              <span className="font-semibold">Name:</span> {product?.name}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {product?.status}
            </p>
            <p>
              <span className="font-semibold">Land Area:</span>{" "}
              {product?.landArea}
            </p>
            <p>
              <span className="font-semibold">Launch Date:</span>{" "}
              {product?.launchDate}
            </p>
          </div>
        </div>

        <form
          className="grid md:grid-cols-2 gap-5"
          onSubmit={handleSubmit(handleUpdate)}
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-2">
            <label>Name</label>
            <input
              type="text"
              defaultValue={product?.name || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newName")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Address</label>
            <input
              type="text"
              defaultValue={product?.address || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newAddress")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Land Area</label>
            <input
              type="text"
              defaultValue={product?.landArea || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newLandArea")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>No Of Floors</label>
            <input
              type="text"
              defaultValue={product?.noOfFloors || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newNoOfFloors")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Apartment Floor</label>
            <input
              type="text"
              defaultValue={product?.apartmentFloor || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newApartmentFloor")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Apartment Size</label>
            <input
              type="text"
              defaultValue={product?.apartmentSize || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newApartmentSize")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Bedroom</label>
            <input
              type="text"
              defaultValue={product?.bedroom || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newBedroom")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Bathroom</label>
            <input
              type="text"
              defaultValue={product?.bathroom || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newBathroom")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Launch Date</label>
            <input
              type="date"
              defaultValue={product?.launchDate || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newLaunchDate")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Collection</label>
            <input
              type="text"
              defaultValue={product?.collection || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newCollection")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Extra Data</label>
            <input
              type="text"
              defaultValue={product?.extraData || ""}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newExtraData")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Status</label>
            <select
              defaultValue={product?.status || "Upcoming"}
              className="w-full border rounded-lg px-3 py-2"
              {...register("newStatus")}
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>Main Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2"
              {...register("newMainImage")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Sub Image 1</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2"
              {...register("newSubImage1")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Sub Image 2</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2"
              {...register("newSubImage2")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Sub Image 3</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-lg px-3 py-2"
              {...register("newSubImage3")}
            />
          </div>

          <div className="md:col-span-2 flex justify-center pt-3">
            <button
              type="submit"
              className="flex items-center gap-3 bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 transition"
            >
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