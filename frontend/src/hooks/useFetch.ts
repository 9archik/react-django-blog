import { useState, useEffect } from 'react';

export interface IUseFetchProps {
	url: string;
	options?: RequestInit;
	enabled?: boolean;
	refetchTime?: number;
}

const useFetch = <data = unknown, error extends Error = Error>({
	url = '',
	options = undefined,
	enabled = true,
	refetchTime,
}: IUseFetchProps) => {
	const [status, setStatus] = useState<{
		data: data | null;
		error: boolean | null;
		loading: boolean;
		errorCode: null | number;
	}>({
		loading: true,
		data: null,
		error: null,
		errorCode: null,
	});

	function fetchNow() {
		setStatus({ ...status, loading: true });

		fetch(url, options)
			.then((res: Response) => {
				if (res.ok) {
					return res.json();
				}
				return Promise.reject(res);
			})
			.then((data: data) => {
				setStatus({ ...status, loading: false, data: data, error: false });
				return data;
			})
			.catch((error: Response) => {
				setStatus({ ...status, loading: false, error: true, errorCode: error.status });
			});
	}

	useEffect(() => {
		if (url && enabled && !refetchTime) {
			fetchNow();
		} else if (url && refetchTime) {
			fetchNow();
			let timer = setInterval(() => {
				fetchNow();
			}, refetchTime);

			return () => clearInterval(timer)
		}
	}, []);

	return { ...status, fetchNow };
};

export default useFetch;
