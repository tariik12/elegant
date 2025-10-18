// Dashboard.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../Provider/AuthProvier';
import Logout from '../Authentication/Logout';
import AdminBanner from '../../Components/HomeComponents/Banner/AdminBanner/AdminBanner';
import Banner from '../../Components/HomeComponents/Banner/Banner';
import AdminDeveloperMetro from '../../Components/HomeComponents/DeveloperMetro/AdminDeveloperMetro/AdminDeveloperMetro';
import DeveloperMetro from '../../Components/HomeComponents/DeveloperMetro/DeveloperMetro';
import AdminLandWanted from '../../Components/HomeComponents/LandWanted/AdminLandWanted/AdminLandWanted';
import LandWanted from '../../Components/HomeComponents/LandWanted/LandWanted';
import AdminLuxuryCollection from '../../Components/HomeComponents/LuxuryCollection/AdminLuxuryCollection/AdminLuxuryCollection';
import LuxuryCollection from '../../Components/HomeComponents/LuxuryCollection/LuxuryCollection';
import Witness from '../../Components/HomeComponents/Witness/Witness';
import AdminProject from '../../Components/ProjectComponents/AdminProject/AdminProject';
import AdminWitness from '../../Components/WitnessComponents/AdminWitness/AdminWitness';
import PrivateRoute from '../Authentication/PrivateRoute';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check authentication status when the component mounts
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      window.location.href = '/login@elegant';
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Logout />
      <Banner />
      <PrivateRoute>
        <AdminBanner />
      </PrivateRoute>
      <Witness />
      <PrivateRoute>
        <AdminWitness />
      </PrivateRoute>
      <PrivateRoute>
        <AdminProject />
      </PrivateRoute>
      <LandWanted />
      <PrivateRoute>
        <AdminLandWanted />
      </PrivateRoute>
      <LuxuryCollection />
      <PrivateRoute>
        <AdminLuxuryCollection />
      </PrivateRoute>
      <DeveloperMetro />
      <PrivateRoute>
        <AdminDeveloperMetro />
      </PrivateRoute>
    </div>
  );
};

export default Dashboard;
