import ProjectTableHead from "./ProjectTableHead";
import UploadProject from "./UploadProject";
import axios from "axios";
import { Link } from "react-router-dom";
import { GrDocumentUpdate } from "react-icons/gr";
import DeleteProject from "./DeleteProject";
import { useQuery } from "react-query";

const StatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border";

  const normalized = (status || "").toLowerCase();

  if (normalized === "ongoing") {
    return <span className={`${base} border-amber-200 bg-amber-50 text-amber-700`}>Ongoing</span>;
  }
  if (normalized === "completed") {
    return <span className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700`}>Completed</span>;
  }
  // default Upcoming
  return <span className={`${base} border-sky-200 bg-sky-50 text-sky-700`}>Upcoming</span>;
};

const AdminProject = () => {
  const { data: products = [], isLoading, isError } = useQuery("products", async () => {
    const response = await axios.get(`${import.meta.env.VITE_URL}/products`);
    return response.data;
  });

  return (
    <div className="my-10 px-4">
      <div className=" mx-auto">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Admin Projects</h3>
            <p className="text-sm text-slate-500">
              Upload, update, and delete projects from the dashboard.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            Total: <span className="font-semibold text-slate-800">{products?.length || 0}</span>
          </div>
        </div>

        {/* Upload form */}
        <div className=" rounded-2xl shadow p-5 mb-8">
          <UploadProject />
        </div>

        {/* Table */}
        <div className=" rounded-2xl shadow overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h4 className="font-semibold text-slate-900">Project List</h4>
            <span className="text-xs text-slate-500">Latest update view</span>
          </div>

          {isLoading && (
            <div className="p-6 text-sm text-slate-600">Loading projects...</div>
          )}

          {isError && (
            <div className="p-6 text-sm text-red-600">Failed to load projects.</div>
          )}

          {!isLoading && !isError && (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <ProjectTableHead />
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {products?.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition">
                      {/* ID */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        #{product.id}
                      </td>

                      {/* Project */}
                      <td className="px-6 py-4 min-w-[260px]">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">
                            {product.name || "Untitled"}
                          </span>
                          <span className="text-xs text-slate-500">
                            {product.address || "No address"}
                          </span>
                          <span className="text-xs text-slate-500">
                            Launch: {product.launchDate || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={product.status} />
                      </td>

                      {/* Land Area */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {product.landArea || "—"}
                      </td>

                      {/* Image */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-12 w-14 rounded-lg overflow-hidden border bg-slate-100">
                          {product.mainImage ? (
                            <img
                              className="h-full w-full object-cover"
                              src={`${import.meta.env.VITE_URL}/images/${product.mainImage}`}
                              alt={product.name || "project"}
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">
                              No image
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Link to={`/updateProject/${product.id}`} title="Update project">
                            <GrDocumentUpdate className="text-3xl text-emerald-600 hover:text-emerald-700 cursor-pointer p-1 border border-emerald-300 hover:border-emerald-400 rounded-lg transition" />
                          </Link>

                          {/* Keep your existing DeleteProject */}
                          <DeleteProject product={product} />
                        </div>
                      </td>
                    </tr>
                  ))}

                  {products?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                        No projects found. Upload your first project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProject;
