import { useForm } from 'react-hook-form';
import { GrDocumentUpdate } from 'react-icons/gr';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useQueryClient } from "react-query";
const UploadProject = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const handleUpload = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('address', data.address);
    formData.append('status', data.status);
    formData.append('landArea', data.landArea);
    formData.append('noOfFloors', data.noOfFloors);
    formData.append('apartmentFloor', data.apartmentFloor);
    formData.append('apartmentSize', data.apartmentSize);
    formData.append('bedroom', data.bedroom);
    formData.append('bathroom', data.bathroom);
    formData.append('launchDate', data.launchDate);
    formData.append('collection', data.collection);
    formData.append('extraData', data.extraData);
    formData.append('mainImage', data.mainImage[0]);
    formData.append('subImage1', data.subImage1[0]);
    formData.append('subImage2', data.subImage2[0]);
    formData.append('subImage3', data.subImage3[0]);

    try {
      await axios.post(`${import.meta.env.VITE_URL}/projectUpload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      queryClient.invalidateQueries("products");
      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Project uploaded successfully',
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
    } catch (error) {
      console.error('Error uploading project:', error);
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'Error Uploading Project',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className='my-16'>
      <h3 className='text-3xl font-thin text-center mb-10'>Admin Upload Project</h3>
      <form
        className='flex flex-col items-center gap-5'
        onSubmit={handleSubmit((data) => handleUpload(data))}
        encType="multipart/form-data"
      >
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="name">Name</label>
        <input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='name' {...register('name')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="address">Address</label>
        <input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='Address' {...register('address')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="status">Status</label>
        <select
  className="w-1/2 border-2 p-2 rounded-md border-black"
  required
  defaultValue="Upcoming"
  {...register("status")}
>
  <option value="Ongoing">Ongoing</option>
  <option value="Upcoming">Upcoming</option>
  <option value="Completed">Completed</option>
</select>

        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="landArea">Land Area</label><input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='Land Area' {...register('landArea')} />
        
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">No of Floors</label><input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='No of Floors' {...register('noOfFloors')} />
        
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Apartment Floor</label><input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='Apartment Floor' {...register('apartmentFloor')} />
        
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Apartment Size</label><input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='Apartment Size' {...register('apartmentSize')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Bedroom</label>
        <input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='Bedroom' {...register('bedroom')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Bathroom</label>
        <input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='Bathroom' {...register('bathroom')} />
        
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Launch Date</label><input className='w-1/2 border-2  p-1 rounded-md border-black' required type='date' placeholder='Launch Date' {...register('launchDate')} />
        
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Collection</label><input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='Collection' {...register('collection')} />
        
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Extra Data</label><input className='w-1/2 border-2  p-1 rounded-md border-black' required type='text' placeholder='Extra Data' {...register('extraData')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Main Image</label>
        <input className='w-1/2 border-2  p-1 rounded-md border-black' required type='file' accept='image/*' {...register('mainImage')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Sub Image 1</label>
        <input className='w-1/2 border-2  p-1 rounded-md border-black' required type='file' accept='image/*' {...register('subImage1')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Sub Image 2</label>
        <input className='w-1/2 border-2  p-1 rounded-md border-black' required type='file' accept='image/*' {...register('subImage2')} />
        <label className='text-bold uppercase text-[#268EC1] text-start' htmlFor="">Sub Image 3</label>
        <input className='w-1/2 border-2  p-1 rounded-md border-black' required type='file' accept='image/*' {...register('subImage3')} />
        

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

export default UploadProject;
