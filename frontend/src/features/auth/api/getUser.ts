import { axios } from '@/lib/axios';

import { AuthUser } from '../types';
import { AxiosResponse } from 'axios';

export const getUser = (): Promise<AxiosResponse<AuthUser>> => {
  return axios.get('/auth/me');
};
