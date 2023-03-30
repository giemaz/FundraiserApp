import React from 'react';
import { RoutingContext } from '../../context/Routing';

import './Button.css';

const Button = (props) => {
	const { setPage } = React.useContext(RoutingContext);

	const handleClick = () => {
		if (props.to) {
			setPage(props.to.slice(1).toLowerCase());
		} else if (props.onClick) {
			props.onClick();
		}
	};

	if (props.href) {
		return (
			<a
				className={`button button--${props.size || 'default'} ${props.inverse && 'button--inverse'} ${
					props.danger && 'button--danger'
				}`}
				href={props.href}>
				{props.children}
			</a>
		);
	}

	return (
		<button
			className={`button button--${props.size || 'default'} ${props.inverse && 'button--inverse'} ${
				props.danger && 'button--danger'
			}`}
			type={props.type}
			onClick={handleClick}
			disabled={props.disabled}>
			{props.children}
		</button>
	);
};

export default Button;
