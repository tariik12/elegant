import { useEffect } from "react";
import { useState } from "react";
 import axios from 'axios'

 import { useQuery } from "react-query";

 const fetchMetro = async () =>{
  const {data} = await axios.get(`${import.meta.env.VITE_URL}/metro`)
  return data;
 }
const DeveloperMetro = () => {

  const [scrolling, setScrolling] = useState(false)

  const {data : metroData, refetch} = useQuery('metroDta', fetchMetro, {
    refetchInterval: 5000,
    })

    useEffect(() =>{
      const interval = setInterval (() =>{
        refetch();
      }, 5000)
      return () =>clearInterval(interval);
    },[refetch])
// TODO: Scroll is not working
  useEffect (() =>{
    const handleScroll =() =>{

        if(window.scrollY >0){

            setScrolling(true);
        }
        else {
            setScrolling(false);
    } 
    };
    window.addEventListener('scroll', handleScroll);

    return () =>{
        window.removeEventListener('scroll', handleScroll)
    }
},[])




  return (
 
      <div>
        {
          metroData?.map(({metroPara, metroImage, id}) =><div
         key={id} className="md:py-36 py-16 bg-fixed bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${import.meta.env.VITE_URL}/images/${metroImage})`,
            backgroundSize: "100% ", // Set background width to 100%
          }}
        >
          <p className={ `  md:w-1/2 text-xl italic font-thin  p-4 md:mx-0 mx-3 rounded-lg md:ms-10 ${scrolling? 'bg-white text-gray-500' :'bg-white text-[#268EC1]'}`}>
          {metroPara}
          </p>
        </div>)
        }
      </div>
   
  );
};

export default DeveloperMetro;
