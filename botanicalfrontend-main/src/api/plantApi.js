import axios from "axios";

const PLANT_API_BASE_URL = "http://localhost:8085/plant-service/plants";

export const getAllPlants = async () => {
  const response = await axios.get(PLANT_API_BASE_URL);
  return response.data;
};
