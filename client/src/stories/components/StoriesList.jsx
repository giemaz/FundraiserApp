import React from 'react';
// import { pagesMapping } from '../shared/context/Routing';
import Card from '../../shared/components/UIElements/Card';
import StoryItem from './StoryItem';

import './StoriesList.css';

const StoriesList = ({ items, onDeleteStory, onConfirmStory, onConfirmStatusChange, showButtons }) => {
	if (items.length === 0) {
		return (
			<div className='story-list center'>
				<Card>
					<h2>No stories found.</h2>
				</Card>
			</div>
		);
	}

	const sortedItems = items.slice().sort((a, b) => {
		const aCompleted = a.current_amount >= a.goal_amount;
		const bCompleted = b.current_amount >= b.goal_amount;

		if (aCompleted === bCompleted) {
			return 0;
		} else if (aCompleted && !bCompleted) {
			return 1;
		} else {
			return -1;
		}
	});

	return (
		<ul className='story-list'>
			{sortedItems.map((story) => (
				<StoryItem
					key={story.id}
					id={story.id}
					image={story.image_url}
					title={story.title}
					description={story.description}
					goal_amount={story.goal_amount}
					current_amount={story.current_amount}
					onDelete={onDeleteStory}
					onConfirmStory={onConfirmStory}
					onConfirmStatusChange={onConfirmStatusChange}
					showButtons={showButtons}
					isApproved={story.is_approved}
				/>
			))}
		</ul>
	);
};

export default StoriesList;
