// bank-page\src\components\Navigation\Navigation.jsx
import React, { useContext, useEffect, useState } from 'react';
import { pagesMapping, RoutingContext } from '../../context/Routing';
import { useAuth } from '../../context/AuthContext';
import classes from './Links.module.css';

function Links() {
	const { setPage, page } = useContext(RoutingContext);
	const { isAuthenticated, logout } = useAuth();
	const [isUserAuthenticated, setIsUserAuthenticated] = useState(isAuthenticated());

	useEffect(() => {
		setIsUserAuthenticated(isAuthenticated());
	}, [isAuthenticated]);

	const handleNavigation = (p) => {
		if (p === pagesMapping.accounts && !isUserAuthenticated) {
			setPage(pagesMapping.auth);
		} else {
			setPage(p);
		}
	};

	const handleLogout = async () => {
		await logout();
		setPage(pagesMapping.auth);
		setIsUserAuthenticated(isAuthenticated());
	};

	return (
		<div className={classes.navLinks}>
			{Object.values(pagesMapping).map((p) => {
				if (p === pagesMapping.auth) {
					return (
						<button
							key={p}
							className={page === p ? classes.active : ''}
							onClick={isUserAuthenticated ? handleLogout : () => setPage(p)}>
							{isUserAuthenticated ? 'Logout' : p}
						</button>
					);
				} else if (p === pagesMapping.accounts) {
					return (
						isUserAuthenticated && (
							<button
								key={p}
								className={page === p ? classes.active : ''}
								onClick={() => handleNavigation(p)}>
								{p}
							</button>
						)
					);
				} else {
					return (
						<button
							key={p}
							className={page === p ? classes.active : ''}
							onClick={() => handleNavigation(p)}>
							{p}
						</button>
					);
				}
			})}
		</div>
	);
}

export default Links;
