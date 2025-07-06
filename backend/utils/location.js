// util/location.js
import axios from "axios";

export const getCoordsForAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "picport-backend"
    }
  });

  const data = response.data;

  if (!data || data.length === 0) {
    throw new Error("Could not find location for the specified address.");
  }

  const location = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };

  return location;
};
