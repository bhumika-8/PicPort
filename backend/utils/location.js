// util/location.js
import axios from "axios";
import HttpError from "../models/http-error.js";

export const getCoordsForAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "picport-backend"
    }
  });

  const data = response.data;

  if (!data || data.length === 0) {
    const error=new HttpError('Could not find the coordinates for the given address, kindly enter valid address',500);
    return next(error);
  }

  const location = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };

  return location;
};
