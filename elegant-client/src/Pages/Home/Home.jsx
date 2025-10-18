
import Banner from "../../Components/HomeComponents/Banner/Banner";



import DeveloperMetro from "../../Components/HomeComponents/DeveloperMetro/DeveloperMetro";

import LandWanted from "../../Components/HomeComponents/LandWanted/LandWanted";

import LuxuryCollection from "../../Components/HomeComponents/LuxuryCollection/LuxuryCollection";
import Witness from "../../Components/HomeComponents/Witness/Witness";



const Home =() =>{

    return(
        <div>
        <Banner></Banner>

        <Witness></Witness>
        
        <LandWanted></LandWanted>
      
        <LuxuryCollection></LuxuryCollection>
        <DeveloperMetro></DeveloperMetro>
        </div>
    )
}

export default Home;