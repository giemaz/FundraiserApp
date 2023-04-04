import React, { useState, useContext } from 'react';
import MainHeader from './MainHeader';
import Links from './Links';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';
import Avatar from '../UIElements/Avatar';
import { AuthContext } from '../../context/auth-context';

const MainNavigation = (props) => {
	const [drawerIsOpen, setDrawerIsOpen] = useState(false);
	const auth = useContext(AuthContext);

	const openDrawerHandler = () => {
		setDrawerIsOpen(true);
	};

	const closeDrawerHandler = () => {
		setDrawerIsOpen(false);
	};

	return (
		<>
			{drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
			<SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
				<nav className='main-navigation__drawer-nav'>
					<Links />
				</nav>
			</SideDrawer>

			<MainHeader>
				<button className='main-navigation__menu-btn' onClick={openDrawerHandler}>
					<span />
					<span />
					<span />
				</button>
				<h1 className='main-navigation__title'>GoScam</h1>
				<div className='main-navigation__wrapper'>
					<nav className='main-navigation__header-nav'>
						<Links />
					</nav>
					{auth.isLoggedIn && (
						<Avatar username={auth.username} image={auth.image} width='60px' height='60px' />
					)}
				</div>
			</MainHeader>
		</>
	);
};

export default MainNavigation;
