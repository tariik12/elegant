
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { GrDocumentUpdate } from 'react-icons/gr';
import { useQuery, useQueryClient } from 'react-query';
import Swal from "sweetalert2";
const AdminLandWanted = () => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const fetchLandWanted = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_URL}/landWanted`);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: landWanted } = useQuery('landWanted', fetchLandWanted);

  const handleUpdate = async (data, id) => {
    const formData = new FormData();
    if(data.newTitle){
      formData.append("landWantedTitle", data.newTitle)
    }
    if(data.newSubTitle){
      formData.append("landWantedSubtitle", data.newSubTitle)
    }
    if(data.newPara){
      formData.append("landWantedPara", data.newPara)
    }
    if(data.newNumber){
      formData.append("phNumber", data.newNumber)
    }
    if(data.newFile){
      formData.append("landImage",data.newFile[0])
    }

    try {
      await axios.patch(`${import.meta.env.VITE_URL}/landUpdate/${id}`, formData);  
      // Invalidate the cache to trigger a refetch
      queryClient.invalidateQueries('landWanted');
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Land Wanted updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      reset();
    } catch (error) {
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Error Uploading Land Wanted",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className='my-16'>
      <h3 className='text-center text-3xl font-thin my-10'>Admin Land Wanted</h3>

      {landWanted &&
        landWanted.map(({ landWantedTitle, landWantedSubtitle, phNumber, landWantedPara, id }) => (
          <form
            key={id}
            className='flex flex-col w-full items-center gap-5'
            onSubmit={handleSubmit((data) => handleUpdate(data, id))}
          >
           <input className='border-2 w-1/2 border-black ' type='text' defaultValue={landWantedTitle} {...register('newTitle')}/>
<input className='border-2 w-1/2 border-black ' type='text' defaultValue={landWantedSubtitle} {...register('newSubTitle')}/>
<input className='border-2 w-1/2 border-black ' type='text' defaultValue={phNumber} {...register('newNumber')}/>
<textarea className='border-2 w-1/2 border-black ' type='text' defaultValue={landWantedPara} {...register('newPara')}/>
<input className='border-2 w-1/2 border-black ' type='file' {...register('newFile')} />
<button type='submit'><GrDocumentUpdate className="text-4xl text-[#8BC34A] courser-pointer hover:text-bold p-1 hover:bg-[#8BC34A] border border-[#8BC34A] hover:text-white rounded-md" title="Click for update" /></button>
          </form>
        ))}
    </div>
  );
};

export default AdminLandWanted;
