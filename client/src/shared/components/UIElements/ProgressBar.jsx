import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentAmount, goalAmount }) => {
	const progressPercentage = (currentAmount / goalAmount) * 100;

	return (
		<div className='progress-bar'>
			<div className='progress-bar__filled' style={{ width: `${progressPercentage}%` }}></div>
		</div>
	);
};

export default ProgressBar;
// eslint-disable-next-line no-lone-blocks
{
	/* <ProgressBar currentAmount={currentAmount} goalAmount={goalAmount} /> */
}
