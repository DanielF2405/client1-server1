// import { useState } from 'react';

type Data<T> = {
  testData?: T;
  fetchFunction: () => Promise<T> | T;
  isTestMode: boolean;
};

export const useFetchData = async <T,>({ testData, fetchFunction, isTestMode }: Data<T>) => {
//   const [data, setData] = useState<T | null>(null);
//   const [error, setError] = useState<Error | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
    if (isTestMode ) {
      if (testData) return testData;
    } else {
      return await fetchFunction()
    }
//   }, [isTestMode, testData, fetchFunction]);

};