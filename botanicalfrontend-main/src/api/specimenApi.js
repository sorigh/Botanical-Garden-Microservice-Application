// api/addressApi.js
import axios from "axios";

const ADDRESS_API_BASE_URL = "http://localhost:8085/specimen-service/specimens";

export const getAllAddresses = async () => {
  const response = await axios.get(ADDRESS_API_BASE_URL);
  return response.data;
};
