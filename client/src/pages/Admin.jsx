import React, { useEffect, useState, useContext } from 'react';
import StoriesList from '../stories/components/StoriesList';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';

const Admin = () => {
	const [loadedStories, setLoadedStories] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [refreshKey, setRefreshKey] = useState(0);

	useEffect(() => {
		const fetchStories = async () => {
			try {
				const responseData = await sendRequest(`http://localhost:3003/stories`, 'GET', null, {
					Authorization: 'Bearer ' + auth.token,
				});
				setLoadedStories(responseData);
			} catch (err) {}
		};
		fetchStories();
	}, [sendRequest, auth.token]);

	const storyConfirmedHandler = (confirmedStoryId) => {
		setLoadedStories((prevStories) =>
			prevStories.map((story) => (story.id === confirmedStoryId ? { ...story, is_approved: true } : story))
		);
		setRefreshKey((prevKey) => prevKey + 1);
	};

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
				<div className='admin-container'>
					<div className='title'>
						<h1>Admin Page</h1>
					</div>
					{!isLoading && loadedStories && (
						<StoriesList
							key={refreshKey}
							items={loadedStories}
							onDeleteStory={storyDeletedHandler}
							showButtons={true}
							onConfirmStory={storyConfirmedHandler}
						/>
					)}
				</div>
			)}
		</>
	);
};

export default Admin;
