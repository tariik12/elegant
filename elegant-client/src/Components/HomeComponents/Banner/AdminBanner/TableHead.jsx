const TableHead =() =>{


    return(
        
            <tr>
          <th scope="col" className="px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th scope="col" className="px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider">
            Title
          </th>
          <th scope="col" className="px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider">
            Image
          </th>
       
          <th scope="col" className="px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider">
        update
          </th>
         
          <th scope="col" className="px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider">
        Delete
          </th>
        </tr>  
        
    )
}

export default TableHead;