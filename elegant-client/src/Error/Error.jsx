import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

const Error = () => {
  const [lottieError, setLottieError] = useState(null);

  useEffect(() => {
    // Fetch the JSON file when the component mounts
    fetch("/erjs.json")
      .then(response => response.json())
      .then(data => setLottieError(data))
      .catch(error => console.error("Error fetching lottieError:", error));
  }, []);

  return (
    <div className=" relative">
      {lottieError && <Lottie className="w-1/3 h-1/3 mx-auto" animationData={lottieError} loop={true} />}
      <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-end items-center">
      <p className="text-center text-4xl font-extrabold text-red-600 mt-5">
        Not Found Page
      </p>
      <Link to="/">
        <button className="bg-green-700 text-white px-2 py-1 rounded-md mt-5">Go To Home</button>
      </Link>
      </div>
    </div>
  );
};

export default Error;
