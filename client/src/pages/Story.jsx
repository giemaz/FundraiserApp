// client\src\pages\Story.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../shared/components/UIElements/Card';
import { useParams } from 'react-router-dom';
import Modal from '../shared/components/UIElements/Modal';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import ProgressBar from '../shared/components/UIElements/ProgressBar';
import { useHttpClient } from '../shared/hooks/http-hook';
import storyImg from '../assets/defaultStory.jpg';
import Donation from '../stories/components/Donation';
import DonationForm from '../stories/components/DonationForm';
import './Story.css';

const Story = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const { id } = useParams();
	const [story, setStory] = useState(null);
	const [donations, setDonations] = useState([]);

	const amountLeftToGoal = story ? Math.max(story.goal_amount - story.current_amount, 0) : 0;

	const fetchStory = useCallback(async () => {
		try {
			const responseData = await sendRequest(`http://localhost:3003/stories/${id}`);
			const donationData = await sendRequest(`http://localhost:3003/stories/${id}/donations`);

			setStory(responseData);
			setDonations(donationData);
		} catch (err) {}
	}, [sendRequest, id]);

	useEffect(() => {
		fetchStory();
	}, [fetchStory]);

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

			<div className='storyPage-item'>
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
					</div>
				</Card>
			</div>
			<div className='storyPage-item'>
				<DonationForm
					storyId={id}
					onDonationSuccess={fetchStory}
					isGoalReached={story.current_amount >= story.goal_amount}
				/>
				<ul className='story-form'>
					{donations.map((donation) => (
						<Donation
							key={donation.id}
							donor_name={donation.donor_name}
							donation_amount={donation.donation_amount}
						/>
					))}
				</ul>
			</div>
		</>
	);
};
export default Story;
