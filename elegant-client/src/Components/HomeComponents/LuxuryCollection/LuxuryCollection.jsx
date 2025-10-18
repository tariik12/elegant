import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchLuxury = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_URL}/luxury`);
  return data;
};

const LuxuryCollection = () => {
  const { data: luxury, isLoading, refetch } = useQuery('luxury', fetchLuxury, {
    refetchInterval: 5000, // Set the refetch interval to 5000 milliseconds (5 seconds)
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Manually refetch data every 5 seconds
      refetch();
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [refetch]);

  return (
    <div className="">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className='flex items-center justify-center'>
          {luxury && luxury.length > 0 && luxury[0]?.youtubeLink ? (
            <iframe
              className="w-full p-5 h-[600px] mb-5"
              src={luxury[0]?.youtubeLink} // Render only the first video if available
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen // Allow full screen
            ></iframe>
          ) : (
            <div>No video available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LuxuryCollection;
