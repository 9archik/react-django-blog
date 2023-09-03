import React, { useContext, useRef } from 'react';
import logo from './logo.svg';
import './App.scss';
import Header from './components/Header/Header';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Posts from './components/Posts/Posts';
import PostPage from './components/PostPage/PostPage';
import { IUserLogin, UserContext, UserProvider } from './providers/UserContext';
import useFetch from './hooks/useFetch';
import { useEffect, useState } from 'react';
import NotFound from './components/NotFound/NotFound';

function App() {
	const firstRender = useRef<boolean>(false);
	const [checkAccount, setCheckAccount] = useState<boolean>(false);
	const { login, setLogin } = useContext(UserContext) as IUserLogin;
	const { data, fetchNow, error, loading, errorCode } = useFetch({
		url: 'http://9archikblog.ru/api/token/refresh/',
		enabled: true,
		options: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		},
		refetchTime: 1000 * 4 * 60,
	});

	useEffect(() => {
		console.log(data);
		if (firstRender?.current && error !== null) {
			console.log(error);
			if (error && data) {
				setLogin(false);
			} else if (data) setLogin(true);
			setCheckAccount(true);
		}
		firstRender.current = true;
	}, [data, error, loading, errorCode]);
	return (
		<>
			{checkAccount ? (
				<>
					<Header />
					<main>
						<Routes>
							<Route path="/" element={<Posts />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/post/:id" element={<PostPage />} />
							<Route path="*" element={<NotFound />} /> 
						</Routes>
					</main>
				</>
			) : (
				<></>
			)}
		</>
	);
}

export default App;
