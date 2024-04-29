export interface IApiResponse {
  path: string;
  success: boolean;
  statusCode: number;
}

export interface IFailedResponse extends IApiResponse {
  message: string[];
}

export interface ISuccessResponse<T> extends IApiResponse {
  result: T;
}
