import { AxiosError } from 'axios';
import { IFailedResponse } from '../Interfaces/IApiResponse';
import toast from 'react-hot-toast';

type ToastWithIntervalProps<T> = {
  interval?: number;
} & (T extends AxiosError<IFailedResponse>
  ? {
      error: T;
    }
  : {
      error: string[];
    });

export const toastWithInterval = <T>({
  interval = 1000,
  error,
}: ToastWithIntervalProps<T>) => {
  const errorMessages =
    error instanceof Array ? error : error.response?.data.message || [];

  errorMessages.map((message, index) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.error(message);
        resolve(0);
      }, interval * index);
    });
  });
};
