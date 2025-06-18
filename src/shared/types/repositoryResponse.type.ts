export type TRepositoryResponse<T> = {
  message: string;
} & (
    | {
      status: 'success';
      data: T;
    }
    | {
      status: 'error';
      error: unknown;
    }
  );

export function isTRepositoryResponse<T>(
  response: TRepositoryResponse<T>,
): response is TRepositoryResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'message' in response &&
    ('data' in response || 'error' in response)
  );
}
export function isSuccessResponse<T>(
  response: TRepositoryResponse<T>,
): response is TRepositoryResponse<T> & { status: 'success'; data: T } {
  return response.status === 'success' && 'data' in response;
}
export function isErrorResponse<T>(
  response: TRepositoryResponse<T>,
): response is TRepositoryResponse<T> & { status: 'error'; error: unknown } {
  return response.status === 'error' && 'error' in response;
}
export function getResponseData<T>(
  response: TRepositoryResponse<T>,
): T | undefined {
  if (isSuccessResponse(response)) {
    return response.data;
  }
  return undefined;
}