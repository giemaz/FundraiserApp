import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import './Links.css';

const Links = (props) => {
	const auth = useContext(AuthContext);

	return (
		<ul className='navLinks'>
			<li>
				<NavLink to='/' exact='true'>
					Home
				</NavLink>
			</li>
			{auth.isLoggedIn && (
				<li>
					<NavLink to='/stories/new'>Create</NavLink>
				</li>
			)}
			{!auth.isLoggedIn && (
				<li>
					<NavLink to='/auth'>Auth</NavLink>
				</li>
			)}
			{auth.isLoggedIn && auth.userType === 'admin' && (
				<li>
					<NavLink to='/admin'>Admin</NavLink>
				</li>
			)}
			{auth.isLoggedIn && (
				<li>
					<button onClick={auth.logout}>Logout</button>
				</li>
			)}
		</ul>
	);
};

export default Links;
