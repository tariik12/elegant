import { useMutation, useQueryClient } from 'react-query';
import React from 'react';
import axios from 'axios';
import { MdDeleteSweep } from 'react-icons/md';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

// Define the DeleteProject component
const DeleteProject = ( {product} ) => {
  const queryClient = useQueryClient();

  const deleteProductMutation = useMutation(
    (productIdToDelete) => axios.delete(`${import.meta.env.VITE_URL}/deleteProject/${productIdToDelete}`),
    {
      onSuccess:() =>{
        queryClient.invalidateQueries('products')
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Banner uploaded successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      },
      onError: (error) => {
        Swal.fire({
          position: "top-center",
          icon:"error",
          title:"Error UPloading Developer Metro",
       
          text: error.message || "Something went wrong.",
          showConfirmButton: false,
          timer:1500,
        })
          reset()
      },
    }
  );
  const handleDelete = async (productIdToDelete) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await deleteProductMutation.mutateAsync(productIdToDelete)
        Swal.fire({
          title: 'Deleted!',
          text: 'Your project has been deleted.',
          icon: 'success',
        });
      }
    } catch (error) {
      console.error('Error deleting project', error);

      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while deleting the project.',
        icon: 'error',
      });
    }
  };

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <MdDeleteSweep
        className="text-4xl text-red-800 cursor-pointer hover:text-bold p-1 hover:bg-red-700 border border-red-700 hover:text-white rounded-md"
        title="Click For Delete"
        onClick={() => handleDelete(product.id)}
      />
    </td>
  );
};

export default DeleteProject;
