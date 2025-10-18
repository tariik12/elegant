const ProjectTableHead =() =>{

    return(
       <tr>
    <th scope='col' className='px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider'>  Id</th>
    <th scope='col' className='px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider'> Name </th>
    <th scope='col' className='px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider'>Land Area  </th>
    <th scope='col' className='px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider'>  Image</th>
    <th scope='col' className='px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider'> Update </th>
    <th scope='col' className='px-6 py-3 text-left text-md font-thin text-gray-500 uppercase tracking-wider'> Delete </th>
       </tr>
    )
    
}

export default ProjectTableHead;