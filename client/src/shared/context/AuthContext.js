// bank-page\src\context\AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

const apiBaseUrl = 'http://localhost:3003';

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [authenticated, setAuthenticated] = useState(false);

	function isAuthenticated() {
		const token = localStorage.getItem('token');
		if (!token) return false;

		try {
			const decoded = jwtDecode(token);
			const currentTime = Date.now() / 1000;
			return currentTime < decoded.exp;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	useEffect(() => {
		if (isAuthenticated()) {
			const token = localStorage.getItem('token');
			const decoded = jwtDecode(token);
			setUser(decoded.username);
			setAuthenticated(true);
		}
	}, []);

	const removeToken = () => {
		localStorage.removeItem('token');
	};

	// Register a new user
	const register = async (email, username, password) => {
		try {
			await axios.post(`${apiBaseUrl}/register`, { email, username, password });
			console.log('User registered successfully');
		} catch (err) {
			console.error(err);
		}
	};

	const login = async (email, password) => {
		try {
			const response = await axios.post(`${apiBaseUrl}/login`, { email, password });
			const receivedToken = response.data.token;
			const decodedToken = jwtDecode(receivedToken);
			setUser(decodedToken.username);
			setAuthenticated(true);
			localStorage.setItem('token', receivedToken);
			console.log('User logged in successfully');
		} catch (err) {
			console.error(err);
		}
	};

	const logout = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.post(
				'http://localhost:3003/logout',
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (response.status === 200) {
				setAuthenticated(false);
				setUser(null);
				removeToken();
			}
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	console.log(`authenticated: ${authenticated}`);

	return (
		<AuthContext.Provider value={{ user, register, login, logout, isAuthenticated, removeToken }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
