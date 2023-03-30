// client\src\shared\components\Navigation\Links.jsx
import React, { useContext } from 'react';
import { pagesMapping, RoutingContext } from '../../context/Routing';
import { AuthContext } from '../../context/auth-context';
import classes from './Links.module.css';

function Links() {
	const { setPage, page } = useContext(RoutingContext);
	const { isLoggedIn, logout } = useContext(AuthContext);

	const handleNavigation = (p) => {
		console.log('Navigating to page:', p);
		if (p === pagesMapping.accounts && !isLoggedIn) {
			setPage(pagesMapping.auth);
		} else {
			setPage(p);
		}
	};

	const handleLogout = () => {
		logout();
		setPage(pagesMapping.auth);
	};

	return (
		<div className={classes.navLinks}>
			{Object.values(pagesMapping).map((p) => {
				if (p === pagesMapping.auth) {
					return (
						<button
							key={p}
							className={page === p ? classes.active : ''}
							onClick={isLoggedIn ? handleLogout : () => setPage(p)}>
							{isLoggedIn ? 'Logout' : p}
						</button>
					);
				} else if (p === pagesMapping.accounts) {
					return (
						isLoggedIn && (
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
