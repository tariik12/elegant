
import {useForm} from "react-hook-form"
import axios from "axios"
import { useLoaderData, useNavigate } from "react-router-dom";
import {GrDocumentUpdate} from "react-icons/gr"
import Swal from "sweetalert2";
const UpdateBanner = () =>{
const banner = useLoaderData()
const navigate = useNavigate()

const {register, handleSubmit, reset} =useForm();
 
    const handleUpdate = async(data,bannerIdToUpdate) =>{
const formData = new FormData();
if(data.newFile){
    formData.append("bannerImage", data.newFile[0]);
}
if(data.newTitle){
    formData.append("title", data.newTitle);
}

console.log(formData)
try{
    await axios.patch( `${import.meta.env.VITE_URL}/updateBanner/${bannerIdToUpdate}`, formData);
    Swal.fire({
        position: "top-center",
        icon: "success",
        title:'Developer Metro Upload successfully',
        showConfirmButton: false,
        timer:1500,
       }) 
        reset()
   navigate('/admin-dashboard')
} catch(error){
    Swal.fire({
        position: "top-center",
        icon:"error",
        title:"Error UPloading Developer Metro",
        showConfirmButton: false,
        timer:1500,
      })
}
    }
    return(
        
        <div className="my-32">
            <h2 className="text-4xl text-center uppercase my-5">Update Your Banner Or Title</h2>
<form className='flex flex-col items-center w-full gap-5' onSubmit={handleSubmit((data) =>handleUpdate(data, banner.id))}>
<label htmlFor="image"> Banner Image</label>
<input className='w-1/2 rounded-md border-2 p-1 border-black' type="file"{...register("newFile")}/>
<label htmlFor="title"> Banner Title</label>
<input className='w-1/2 rounded-md border-2 p-1 border-black' defaultValue={banner.title} type="text" placeholder="Enter new title" {...register("newTitle")}/>
<button type="submit"><GrDocumentUpdate className='border p-1 text-4xl text-[#8BC34A] border-[#8BC34A] hover:text-white hover:bg-[#8BC34A]'/></button>
</form>
        </div>
    )
}

export default UpdateBanner;