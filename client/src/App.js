import React, { useContext } from 'react';
import { RoutingContext, pagesMapping } from './shared/context/Routing';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import Home from './pages/Home';
import Create from './pages/Create';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import Router from './shared/context/Routing';

const App = () => {
	const { token, login, logout, userId, userType } = useAuth();

	const { page } = useContext(RoutingContext);
	console.log('Current page:', page);

	const renderPage = () => {
		console.log('Rendering page:', page);
		if (!token) {
			if (page === pagesMapping.auth || page === pagesMapping.home || page === pagesMapping.create) {
				console.log('Rendering Auth');
				return <Auth />;
			}
		}

		switch (page) {
			case pagesMapping.auth:
				return token ? <Home /> : <Auth />;
			case pagesMapping.create:
				return token ? <Create /> : <Auth />;
			case pagesMapping.admin:
				return token && userType === 'admin' ? <Admin /> : <Home />;
			// Add other cases if needed
			default:
				return <Home />;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isLoggedIn: !!token,
				token: token,
				userId: userId,
				userType: userType,
				login: login,
				logout: logout,
			}}>
			<Router>
				<MainNavigation />
				<main>{renderPage()}</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;
