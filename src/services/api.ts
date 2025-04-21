import axios from 'axios';
import type { Rocket } from '@/types/rockets';

const BASE_URL = 'https://api.spacexdata.com/v4/rockets';

export const getAllRockets = async (): Promise<Rocket[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getRocketById = async (id: string): Promise<Rocket> => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const filterRockets = async (query: object): Promise<Rocket[]> => {
  const response = await axios.post(`${BASE_URL}/query`, {
    query,
    options: { sort: { name: 'asc' } }
  });
  return response.data.docs;
};
