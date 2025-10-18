
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { GrDocumentUpdate } from 'react-icons/gr';
import { useQuery, useQueryClient } from 'react-query';
import Swal from "sweetalert2";
const fetchLuxury = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_URL}/luxury`);
  return data;
};

const AdminLuxuryCollection = () => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data: luxury } = useQuery('luxury', fetchLuxury, {
    refetchInterval: 5000, // Set the refetch interval to 5000 milliseconds (5 seconds)
  });

  const handleUpdate = async (data, id) => {
    const formData = new FormData();

    if (data.newLink) {
      formData.append('youtubeLink', data.newLink);
    }
    if (data.newFile) {
      formData.append('luxuryImage', data.newFile[0]);
    }

    try {
      await axios.patch(`${import.meta.env.VITE_URL}/luxuryUpdate/${id}`, formData);
      queryClient.invalidateQueries('luxury');
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Luxury Collection uploaded successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
    } catch (error) {
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Error Uploading Luxury Collection",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="my-16">
      <h3 className="text-center text-3xl font-thin my-10">Admin Luxury Collection</h3>
      <form
        className="flex w-full flex-col items-center gap-5"
        onSubmit={handleSubmit((data) => handleUpdate(data, luxury && luxury.length > 0 ? luxury[0].id : null))}
      >
        <input className="w-1/2 border-2 border-black" type="link" {...register('newLink')} />
        <input className="w-1/2 border-2 border-black" type="file" {...register('newFile')} />

        <button type="submit">
          <GrDocumentUpdate
            className="text-4xl text-[#8BC34A] courser-pointer hover:text-bold p-1 hover:bg-[#8BC34A] border border-[#8BC34A] hover:text-white rounded-md"
            title="Click for update"
          />
        </button>
      </form>
    </div>
  );
};

export default AdminLuxuryCollection;
