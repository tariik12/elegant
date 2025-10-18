import { useEffect, } from 'react';
import { useForm } from 'react-hook-form';
import { GrDocumentUpdate } from 'react-icons/gr';
import axios from 'axios';
import { useQuery, useMutation } from 'react-query';
import Swal from "sweetalert2";
const fetchWitnessData = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_URL}/witness`);
  return data;
};

const updateWitness = async ({ id, newTitle, newPara }) => {
  const formData = new FormData();
  if (newTitle) {
    formData.append('witnessTitle', newTitle);
  }
  if (newPara) {
    formData.append('witnessPara', newPara);
  }

  await axios.patch(`${import.meta.env.VITE_URL}/updateWitness/${id}`, formData);
};

const AdminWitness = () => {
  const { register, handleSubmit, reset } = useForm();
  const { data: witnessData, refetch } = useQuery('witnessData', fetchWitnessData);
  const mutation = useMutation(updateWitness);

  useEffect(() => {
    reset();
  }, [witnessData, reset]);

  const handleUpdate = async (data, id) => {
    try {
      await mutation.mutateAsync({ id, ...data });
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Banner uploaded successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      refetch(); // Manually refetch the data after updating
    } catch (error) {
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
    <div className="my-16">
      <h3 className="text-3xl font-thin text-center">Admin Witness</h3>

      {witnessData &&
        witnessData.map(({ id, witnessTitle, witnessPara }) => (
          <form
            key={id}
            className="flex flex-col items-center w-full gap-5 mt-5"
            onSubmit={handleSubmit((data) => handleUpdate(data, id))}
          >
            <input
              className="border-2 border-black w-1/2"
              type="text"
              {...register('newTitle')}
              defaultValue={witnessTitle}
            />
            <textarea
              className="border-2 border-black w-1/2"
              type="text"
              {...register('newPara')}
              defaultValue={witnessPara}
            />

            <button type="submit">
              <GrDocumentUpdate
                className="text-4xl text-[#8BC34A] cursor-pointer hover:text-bold p-1 hover:bg-[#8BC34A] border border-[#8BC34A] hover:text-white rounded-md"
                title="Click For approved"
              />
            </button>
          </form>
        ))}
    </div>
  );
};

export default AdminWitness;
