import Container from "../../../Shared/Container/Container";
import {useEffect, useState } from 'react' 
import axios from 'axios'
const LandWanted=() =>{
const [landWanted , setLandWanted] = useState([])
useEffect(() =>{
    const fetchData = async () =>{
        try{
            const {data} = await axios.get(`${import.meta.env.VITE_URL}/landWanted`)
            setLandWanted(data)
        }catch(err){
console.log(err)
        }
    }
    fetchData()
},[import.meta.env.VITE_URL])
console.log(landWanted)
    return(
        <Container>

       {
        landWanted?.map(({landWantedTitle, landWantedSubtitle, phNumber, landWantedPara, landImage, id}) => <div key={id} className="md:flex justify-evenly items-center my-16 gap-10">
        <div>
            <img className=" rounded-md p-2 w-1\2 " src={`${import.meta.env.VITE_URL}/images/${landImage}`} alt="" />
        </div>
        <div className="md:w-full">
            <h2 className=" text-2xl   md:text-4xl font-thin text-[#268EC1] uppercase md:py-0 pt-4">{landWantedTitle}</h2>
            <h4 className="md:text-2xl font-bold md:font-medium py-5">{landWantedSubtitle}</h4>
            <h6 className="text-xl ">CALL US NOW <span className="text-[#268EC1] font-bold">+880 {phNumber}</span> </h6>
        <p className="text-gray-500 italic pt-5 text-xl">{landWantedPara}</p>
        </div>
        
    </div>) }  </Container>
    )
}

export default LandWanted;