import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { MdDeleteSweep } from 'react-icons/md';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

const DeleteBanner = ({ banner }) => {
  const queryClient = useQueryClient();

  const deleteBannerMutation = useMutation(
    (bannerIdToDelete) => axios.delete(`${import.meta.env.VITE_URL}/deleteBanner/${bannerIdToDelete}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('banners'); // Corrected query key
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Banner deleted successfully", // Corrected message for deletion
          showConfirmButton: false,
          timer: 1500,
        });
      },
      onError: (error) => {
        Swal.fire({
          position: "top-center",
          icon: "error",
          title: "Error Deleting Banner", // Clearer title for clarity
          text: error.message || "Something went wrong.", // Display specific error message
          showConfirmButton: false,
          timer: 1500,
        });
      },
    }
  );

  const handleDelete = async (bannerIdToDelete) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "Do You Want to Delete This?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText:
 
'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await deleteBannerMutation.mutateAsync(bannerIdToDelete);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your banner has been deleted.',
          icon: 'success',
        });
      }
    } catch (error) {
      console.error('Error deleting banner', error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while deleting the banner.',
        icon: 'error',
      });
    }
  };

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <MdDeleteSweep
        className="text-4xl text-red-800 cursor-pointer hover:text-bold p-1 hover:bg-red-700 border border-red-700 hover:text-white rounded-md"
        title="Click For Delete"
        onClick={() => handleDelete(banner.id)}
      />
    </td>
  );
};

export default DeleteBanner;