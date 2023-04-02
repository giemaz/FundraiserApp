import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentAmount, goalAmount }) => {
	const progressPercentage = (currentAmount / goalAmount) * 100;
	const isCompleted = progressPercentage >= 100;

	return (
		<div className='progress-bar'>
			<div className='progress-bar__filled' style={{ width: `${Math.min(progressPercentage, 100)}%` }}>
				{isCompleted ? (
					<span className='progress-bar__completed'>Completed</span>
				) : (
					<span className='progress-bar__percentage'>{progressPercentage.toFixed(0)}%</span>
				)}
			</div>
		</div>
	);
};

export default ProgressBar;
