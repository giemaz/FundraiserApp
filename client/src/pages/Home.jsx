import React, { useEffect, useState } from 'react';
import StoriesList from '../stories/components/StoriesList';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import './Home.css';

const Home = () => {
	const [loadedStories, setLoadedStories] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	useEffect(() => {
		const fetchStories = async () => {
			try {
				const responseData = await sendRequest(`http://localhost:3003/stories`);
				setLoadedStories(responseData.stories);
			} catch (err) {}
		};
		fetchStories();
	}, [sendRequest]);

	const storyDeletedHandler = (deletedStoryId) => {
		setLoadedStories((prevStories) => prevStories.filter((story) => story.id !== deletedStoryId));
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className='center'>
					<LoadingSpinner />
				</div>
			)}
			{!isLoading && (
				<div className='title'>
					<h1>Home Page</h1>
				</div>
			)}
			{!isLoading && loadedStories && <StoriesList items={loadedStories} onDeleteStory={storyDeletedHandler} />}
		</>
	);
};

export default Home;
