// client\src\shared\hooks\http-hook.js
import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const activeHttpRequests = useRef([]);

	const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
		setIsLoading(true);

		const httpAbortCtrl = new AbortController();

		activeHttpRequests.current.push(httpAbortCtrl);

		try {
			const requestOptions = {
				method,
				headers,
				signal: httpAbortCtrl.signal,
			};

			if (body && method !== 'GET' && method !== 'HEAD') {
				requestOptions.body = body instanceof FormData ? body : JSON.stringify(body);
			}

			const response = await fetch(url, requestOptions);

			const responseData = await response.json();

			activeHttpRequests.current = activeHttpRequests.current.filter((reqCtrl) => reqCtrl !== httpAbortCtrl);

			if (!response.ok) {
				throw new Error(responseData.message);
			}

			setIsLoading(false);

			return responseData;
		} catch (err) {
			setError(err.message);
			setIsLoading(false);

			throw err;
		}
	}, []);

	const clearError = () => {
		setError(null);
	};

	useEffect(() => {
		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
		};
	}, []);

	return { isLoading, error, sendRequest, clearError };
};
