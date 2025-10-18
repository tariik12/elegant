
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { GrDocumentUpdate } from 'react-icons/gr';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
const UpdateProject = () => {
  const product = useLoaderData();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const handleUpdate = async (data, productIdToUpdate) => {
    const formData = new FormData();

    // Add other form data fields as needed
    if (data.newName) {
      formData.append("name", data.newName);
    }
    if (data.newAddress) {
      formData.append("address", data.newAddress);
    }


    if (data.newStatus) {
      formData.append("status", data.newStatus);
    }

    if (data.newLandArea) {
      formData.append("landArea", data.newLandArea);
    }

    if (data.newNoOfFloors) {
      formData.append("noOfFloors", data.newNoOfFloors);
    }

    if (data.newApartmentFloor) {
      formData.append("apartmentFloor", data.newApartmentFloor);
    }

    if (data.newApartmentSize) {
      formData.append("apartmentSize", data.newApartmentSize);
    }

    if (data.newBedroom) {
      formData.append("bedroom", data.newBedroom);
    }

    if (data.newBathroom) {
      formData.append("bathroom", data.newBathroom);
    }

    if (data.newLaunchDate) {
      formData.append("launchDate", data.newLaunchDate);
    }

    if (data.newCollection) {
      formData.append("collection", data.newCollection);
    }

    if (data.newExtraData) {
      formData.append("extraData", data.newExtraData);
    }

    // Add main image if provided
    if (data.newMainImage[0]) {
      formData.append("mainImage", data.newMainImage[0]);
    }

    if (data.newsMbImage1[0]) {
      formData.append("subImage1", data.newsMbImage1[0]);
    }

    if (data.newSubImage2[0]) {
      formData.append("subImage2", data.newSubImage2[0]);
    }

    if (data.newSubImage3[0]) {
      formData.append("subImage3", data.newSubImage3[0]);
    }

    try {
      await axios.patch(`${import.meta.env.VITE_URL}/updateProduct/${productIdToUpdate}`, formData);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Project updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      navigate('/admin-dashboard');
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
    <div>
      <h3 className='text-4xl text-center font-thin mb-5'>Admin Project Update</h3>
      <form
        className='flex flex-col items-center gap-5'
        onSubmit={handleSubmit((data) => handleUpdate(data, product.id))}
        encType="multipart/form-data"
      >
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="name">Name</label>
        <input className='w-1/2 p-1 border-2 border-black'  type='text' placeholder='name' {...register('newName')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="address">Address</label>
        <input className='w-1/2 p-1 border-2 border-black' type='text' placeholder='Address' {...register('newAddress')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="status">Status</label>
        <input className='w-1/2 p-1 border-2 border-black'  type='text' placeholder='status' {...register('newStatus')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="landArea">Land Area</label>
        <input className='w-1/2 p-1 border-2 border-black' type='text' placeholder='Land Area' {...register('newLandArea')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">No of Floors</label>
        <input className='w-1/2 p-1 border-2 border-black' type='text' placeholder='No of Floors' {...register('newNoOfFloors')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Apartment Floor</label>
        <input className='w-1/2 p-1 border-2 border-black' type='text' placeholder='Apartment Floor' {...register('newApartmentFloor')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Apartment Size</label>
        <input className='w-1/2 p-1 border-2 border-black' type='text' placeholder='Apartment Size' {...register('newApartmentSize')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Bedroom</label>
        <input className='w-1/2 p-1 border-2 border-black' type='text' placeholder='Bedroom' {...register('newBedroom')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Bathroom</label>
        <input className='w-1/2 p-1 border-2 border-black' type='text' placeholder='Bathroom' {...register('newBathroom')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Launch Date</label>
        <input className='w-1/2 p-1 border-2 border-black' type='date' placeholder='Launch Date' {...register('newLaunchDate')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Collection</label>
        <input className='w-1/2 p-1 border-2 border-black' type='text' placeholder='Collection' {...register('newCollection')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Extra Data</label>
        <input className='w-1/2 p-1 border-2 border-black'  type='text' placeholder='Extra Data' {...register('newExtraData')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Main Image</label>
        <input className='w-1/2 p-1 border-2 border-black' type='file' accept='image/*' {...register('newMainImage')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Sub Image 1</label>
        <input className='w-1/2 p-1 border-2 border-black' type='file' accept='image/*' {...register('newsMbImage1')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Sub Image 2</label>
        <input className='w-1/2 p-1 border-2 border-black' type='file' accept='image/*' {...register('newSubImage2')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Sub Image 3</label>
        <input className='w-1/2 p-1 border-2 border-black' type='file' accept='image/*' {...register('newSubImage3')} />

        <button type='submit'>
          <GrDocumentUpdate
            className="text-4xl text-[#8BC34A] cursor-pointer hover:text-bold p-1 hover:bg-[#8BC34A] border border-[#8BC34A] hover:text-white rounded-md"
            title="Click For approved"
          />
        </button>
      </form>
    </div>
  );
};

export default UpdateProject;
