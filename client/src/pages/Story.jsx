// client\src\pages\Story.jsx
import React, { useState, useEffect } from 'react';
import Card from '../shared/components/UIElements/Card';
import { useParams } from 'react-router-dom';
import Button from '../shared/components/FormElements/Button';
import Modal from '../shared/components/UIElements/Modal';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import ProgressBar from '../shared/components/UIElements/ProgressBar';

import { useHttpClient } from '../shared/hooks/http-hook';

import storyImg from '../assets/defaultStory.jpg';
import './Story.css';
import DonationForm from '../shared/components/DonationForm/DonationForm';

const Story = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const { id } = useParams();
	const [story, setStory] = useState(null);

	const amountLeftToGoal = story ? story.goal_amount - story.current_amount : 0;

	const donationHandler = () => {};

	useEffect(() => {
		const fetchStory = async () => {
			try {
				const responseData = await sendRequest(`http://localhost:3003/stories/${id}`);

				setStory(responseData);
			} catch (err) {}
		};
		fetchStory();
	}, [sendRequest, id]);

	if (isLoading) {
		return (
			<div className='center'>
				<LoadingSpinner />
			</div>
		);
	}

	if (!story) {
		return (
			<div className='center'>
				<h2>No story found.</h2>
			</div>
		);
	}

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<Modal></Modal>

			<li className='storyPage-item'>
				<Card className='storyPage-item__content'>
					{isLoading && <LoadingSpinner asOverlay />}
					<div className='storyPage-item__image'>
						<img
							src={story.image_url ? `http://localhost:3003/${story.image_url}` : storyImg}
							alt={story.title}
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = storyImg;
							}}
						/>
					</div>
					<div className='storyPage-item__info'>
						<h2>{story.title}</h2>
						<p>{story.description}</p>
						<div className='storyPage-item__sum'>
							<h3>{story.current_amount}€</h3>
							<h3>{story.goal_amount}€</h3>
						</div>
					</div>
					<div>
						<ProgressBar currentAmount={story.current_amount} goalAmount={story.goal_amount} />
					</div>
					<div className='storyPage-item__actions'>
						<div>{amountLeftToGoal}€ left to the goal</div>
						<DonationForm />
					</div>
				</Card>
			</li>
		</>
	);
};
export default Story;
