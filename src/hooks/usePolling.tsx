import { useState, useEffect, useRef } from "react";
import { UsePollingResult } from "../type/UsePollingResult";

// Определение хука usePolling
export const usePolling = <T,>({
  url,
  interval,
  initialData,
}: {
  url: string;
  interval: number;
  initialData: T[];
}): UsePollingResult<T> => {
  // Состояния данных, загрузки и ошибки
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const timestampRef = useRef<number>();

  useEffect(() => {
    // Функция для выполнения запроса
    const fetchData = async () => {
      // Создание новой временной метки
      const timestamp = Date.now();
      // Сохранение временной метки в useRef
      timestampRef.current = timestamp;
      // Установка флага загрузки
      setIsLoading(true);

      try {
        // Отправка запроса
        const response = await fetch(url);

        // Проверка успешности запроса
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        // Получение данных и их обновление
        const jsonData = await response.json();
        if (timestampRef.current === timestamp) {
          setData(jsonData);
        }
      } catch (error) {
        // Обработка ошибки запроса
        console.error(error);
        setError(error);
      } finally {
        // Снятие флага загрузки
        setIsLoading(false);
      }
    };

    // Выполнение запроса при монтировании компонента
    fetchData();

    // Установка интервала для повторного выполнения запроса
    const intervalId = setInterval(fetchData, interval);

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [url, interval]); // Зависимости для повторного выполнения эффекта

  // Возвращение данных, флага загрузки и ошибки
  return { data, isLoading, error };
};
