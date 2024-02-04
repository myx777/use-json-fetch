// Определение типа результата хука
export type UsePollingResult<T> = {
  data: T[];
  isLoading: boolean;
  error: Error | null;
};