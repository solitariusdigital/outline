import React, { useState } from "react";

const GetLocationButton = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
  });
  const [error, setError] = useState(null);

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(success, errorHandler, options);
  };

  const success = (pos) => {
    const crd = pos.coords;
    setLocation({
      latitude: crd.latitude,
      longitude: crd.longitude,
      accuracy: crd.accuracy,
    });
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
  };

  const errorHandler = (err) => {
    let errorMessage;

    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = "User denied the request for Geolocation.";
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable.";
        break;
      case err.TIMEOUT:
        errorMessage = "The request to get user location timed out.";
        break;
      case err.UNKNOWN_ERROR:
        errorMessage = "An unknown error occurred.";
        break;
      default:
        errorMessage = "An error occurred while retrieving location.";
    }

    setError(errorMessage);
    console.warn(`ERROR(${err.code}): ${errorMessage}`);
  };

  const getSuburbName = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.address) {
        const suburb =
          data.address.suburb || data.address.city || "Suburb not found";
        setSuburb(suburb);
      } else {
        setError("Error retrieving data.");
      }
    } catch (error) {
      setError("Network error: " + error.message);
    }
  };

  return (
    <div>
      <button onClick={() => getLocation()}>...</button>
      {error && <p>{error}</p>}
      {location.latitude && location.longitude && (
        <div>
          <h2>Your Current Position:</h2>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy} meters</p>
        </div>
      )}
    </div>
  );
};

export default GetLocationButton;
