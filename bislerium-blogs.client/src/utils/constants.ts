import axios from 'axios';

export const COLORS = {
  primary: '#242424',
};

export const api = axios.create({
  baseURL: `https://localhost:7004/api`,
});
