// client\src\shared\hooks\auth-hook.js
import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
	const [token, setToken] = useState(false);
	const [tokenExpirationDate, setTokenExpirationDate] = useState();
	const [userId, setUserId] = useState(false);
	const [userType, setUserType] = useState('writer');
	const [username, setUsername] = useState(null);
	const [image, setImage] = useState(null);

	const login = useCallback((uid, token, userType, username, image, expirationDate) => {
		setToken(token);
		setUserId(uid);
		setUserType(userType);
		setUsername(username);
		setImage(image);
		const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
		setTokenExpirationDate(tokenExpirationDate);
		localStorage.setItem(
			'userData',
			JSON.stringify({
				userId: uid,
				token: token,
				userType: userType,
				username: username,
				image: image,
				expiration: tokenExpirationDate.toISOString(),
			})
		);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setTokenExpirationDate(null);
		setUserId(null);
		setUserType('writer');
		setUsername(null);
		setImage(null);
		localStorage.removeItem('userData');
	}, []);

	useEffect(() => {
		if (token && tokenExpirationDate) {
			const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [token, logout, tokenExpirationDate]);

	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('userData'));
		if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
			login(
				storedData.userId,
				storedData.token,
				storedData.userType,
				storedData.username,
				storedData.image,
				new Date(storedData.expiration)
			);
		}
	}, [login]);

	return { token, login, logout, userId, userType, username, image };
};
