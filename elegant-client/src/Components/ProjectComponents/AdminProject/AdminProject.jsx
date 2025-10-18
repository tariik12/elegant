
import ProjectTableHead from "./ProjectTableHead"
import UploadProject from "./UploadProject"
import axios from "axios"
import { Link } from "react-router-dom"
import { GrDocumentUpdate } from "react-icons/gr"
import DeleteProject from "./DeleteProject"
import { useQuery } from "react-query";
const AdminProject =() =>{
  

    const { data: products } = useQuery("products", async () => {
      const response = await axios.get(`${import.meta.env.VITE_URL}/products`);
      return response.data;
    });
return(
    <div className='my-16'>

<h3 className='text-center uppercase'> Admin product</h3>
        <UploadProject></UploadProject>
        <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
<ProjectTableHead></ProjectTableHead>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            { products?.map(product => (
          <tr key={product.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-xs font-thin text-gray-900">{product.id}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-xs font-thin text-gray-900">{product.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-xs font-thin text-gray-900">{product.landArea}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <img className="h-10 w-10 rounded-md" src={`${import.meta.env.VITE_URL}/images/${product.mainImage}`} alt={`Image for ${product.title}`} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
             <Link to={`/updateProject/${product.id}`}>
<GrDocumentUpdate
        className="text-4xl text-[#8BC34A] cursor-pointer hover:text-bold p-1 hover:bg-[#8BC34A] border border-[#8BC34A] hover:text-white rounded-md"
        title="Click For approved"
       
      />
</Link>
    
            </td>
         
           
     <DeleteProject product={product} ></DeleteProject>       
           
          </tr>
        ))}
            </tbody>
        </table>
       

    </div>
)
}

export default AdminProject