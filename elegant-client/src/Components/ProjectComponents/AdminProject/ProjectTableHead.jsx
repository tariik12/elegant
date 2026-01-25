const ProjectTableHead = () => {
  return (
    <tr>
      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        ID
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Project
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Status
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Land Area
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Image
      </th>
      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Actions
      </th>
    </tr>
  );
};

export default ProjectTableHead;
