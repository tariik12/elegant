import {
    createBrowserRouter, 
   
  } from "react-router-dom";

import Projects from "../Pages/Projects/Projects/Projects";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import AboutUs from "../Pages/AboutUs/AboutUs";
import ContactUs from "../Pages/ContactUs/ContactUs";
import ConstructionStatus from "../Pages/ConstructionStatus/ConstructionStatus";
import WitnessCardDetails from "../Components/WitnessComponents/Details/WitnessCardDetails";
import Blogs from "../Pages/Blogs/Blogs";
import Gallery from "../Pages/Gallery/Gallery";
import Reviews from "../Pages/Reviews/Reviews";
import Legal from "../Pages/Legal/Legal";
import OnGoing from "../Components/ProjectComponents/OnGoing/OnGoing";
import UpComing from "../Components/ProjectComponents/UpComing/UpComing";
import Completed from "../Components/ProjectComponents/Completed/Completed";
import UpdateBanner from "../Components/HomeComponents/Banner/AdminBanner/UpdateBanner";
import Dashboard from "../Pages/Dashboard/Dashboard";
import UpdateProject from "../Components/ProjectComponents/AdminProject/UpdateProject";
import Login from "../Pages/Authentication/Login";
import PrivateRoute from "../Pages/Authentication/PrivateRoute";
import Error from "../Error/Error";
  

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
      errorElement:<Error></Error>,
      children: [
        {
          path:"/",
          element: <Home></Home>
        },
        {
            path:'/projects',
            element:<Projects></Projects>
        },
        {
          path:'about-us',
          element:<AboutUs></AboutUs>
        },
      {
        path:'/contact-us',
        element:<ContactUs></ContactUs>
      },
      {
        path:'/on-going',
        element:<OnGoing/>
      },
      {
        path:'/up-coming',
        element:<UpComing/>
      },
      {
        path:'/completed',
        element:<Completed/>
      },

      {
        path:'/construction-status',
        element:<ConstructionStatus></ConstructionStatus>
      },
      {
        path: '/details/:id',
        element: <WitnessCardDetails></WitnessCardDetails>,
      },

      {
        path:'/blogs',
        element:<Blogs></Blogs>
      },

      {
        path:'/gallery',
        element:<Gallery></Gallery>
      },
      {
        path:'/reviews',
        element:<Reviews></Reviews>
      },

      {
        path:'/feedback',
        element:<Legal></Legal>
      },
      {
        path:'/legal',
        element:<Legal></Legal>
      },

    
      ]
      
    },
{
  path:'/admin-dashboard',
  element:<PrivateRoute><Dashboard></Dashboard></PrivateRoute>
},
{
  path:'/login@elegant-admin',
  element:<Login></Login>
},
{
  path:'update/:id',
  element:<PrivateRoute><UpdateBanner></UpdateBanner></PrivateRoute>,
  loader:({params}) => fetch(`${import.meta.env.VITE_URL}/getDataById/${params.id}`)
},
{
  path:'updateProject/:id',
  element:<PrivateRoute><UpdateProject></UpdateProject></PrivateRoute>,
  loader:({params}) => fetch(`${import.meta.env.VITE_URL}/getByProjectId/${params.id}`)
}

  ]);
  