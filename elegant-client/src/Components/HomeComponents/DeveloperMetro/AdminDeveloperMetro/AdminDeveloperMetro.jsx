import { useForm } from 'react-hook-form';
import Swal from "sweetalert2";

import axios from 'axios';
import { GrDocumentUpdate } from 'react-icons/gr';
import {useQuery, useQueryClient} from 'react-query';
const fetchMetro = async () =>{
  const {data} = await axios.get(`${import.meta.env.VITE_URL}/metro`);
  return data;
}

const AdminDeveloperMetro = () => {
  const { register, handleSubmit,reset } = useForm();
const queryClient = useQueryClient();

const {data : metroData} = useQuery('metroData', fetchMetro, {
  refetchInterval : 5000,
})


  const handleUpdate = async (data,id) => {
   
   
    const formData = new FormData();

    if (data.newPara) {
      formData.append('metroPara', data.newPara);
    }
    if (data.newFile) {
      formData.append('metroImage', data.newFile[0]);
    }

    try {
      await axios.patch(`${import.meta.env.VITE_URL}/metroUpdate/${id}`, formData);
      queryClient.invalidateQueries('metroData')
     Swal.fire({
      position: "top-center",
      icon: "success",
      title:'Developer Metro Upload successfully',
      showConfirmButton: false,
      timer:1500,
     }) 
      reset()
    } catch (error) {
    Swal.fire({
      position: "top-center",
      icon:"error",
      title:"Error UPloading Developer Metro",
      showConfirmButton: false,
      timer:1500,
    })
    }
  };

  return (
    <div className="my-16">
      <h3 className="text-center text-3xl font-thin my-10">Admin Developer Metro</h3>

      <form
        className="flex flex-col gap-5 items-center w-full"
        onSubmit={handleSubmit((data) =>handleUpdate(data, metroData && metroData.length > 0 ? metroData[0].id : null))}
      >
        <textarea className="border-2 border-black w-1/2" type="text" defaultValue={metroData && metroData.length > 0 ? metroData[0].metroPara : null} name="metroPara" {...register('newPara')} />
        <input className="border-2 border-black w-1/2" type="file" {...register('newFile')} />
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

export default AdminDeveloperMetro;
