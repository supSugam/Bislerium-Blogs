import axios from 'axios';

export const COLORS = {
  primary: '#242424',
};

export const api = axios.create({
  baseURL: `http://localhost:7004/${7004}/api`,
});
