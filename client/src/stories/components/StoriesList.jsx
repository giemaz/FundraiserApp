import React from 'react';
// import { pagesMapping } from '../shared/context/Routing';
import Card from '../../shared/components/UIElements/Card';
import StoryItem from './StoryItem';

import './StoriesList.css';

const StoriesList = ({ items, onDeleteStory, onConfirmStatusChange }) => {
	if (items.length === 0) {
		return (
			<div className='story-list center'>
				<Card>
					<h2>No stories found.</h2>
				</Card>
			</div>
		);
	}

	return (
		<ul className='story-list'>
			{items.map((story) => (
				<StoryItem
					key={story.id}
					id={story.id}
					image={story.image_url}
					title={story.title}
					description={story.description}
					goal_amount={story.goal_amount}
					current_amount={story.current_amount}
					onDelete={onDeleteStory}
					onConfirmStatusChange={onConfirmStatusChange}
				/>
			))}
		</ul>
	);
};

export default StoriesList;
