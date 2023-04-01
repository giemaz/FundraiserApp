import React, { useEffect, useState, useContext } from 'react';
import StoriesList from '../stories/components/StoriesList';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import './Admin.css';

const Home = () => {
	const [loadedStories, setLoadedStories] = useState();
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);

	useEffect(() => {
		const fetchStories = async () => {
			try {
				const responseData = await sendRequest(`http://localhost:3003/stories/approved`, 'GET', null, {
					Authorization: 'Bearer ' + auth.token,
				});
				setLoadedStories(responseData);
			} catch (err) {}
		};
		fetchStories();
	}, [sendRequest, auth.token]);

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
			{!isLoading && loadedStories && <StoriesList items={loadedStories} showButtons={false} />}
		</>
	);
};

export default Home;
