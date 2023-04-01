import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ProgressBar from '../../shared/components/UIElements/ProgressBar';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import storyImg from '../../assets/defaultStory.jpg';
import './StoryItem.css';

const StoryItem = ({ id, onDelete, title, description, image, goal_amount, current_amount }) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [currentAction, setCurrentAction] = useState(null);

	const truncateDescription = (description, wordLimit) => {
		const words = description.split(' ');
		if (words.length > wordLimit) {
			return words.slice(0, wordLimit).join(' ');
		}
		return description;
	};

	const showDeleteWarningHandler = () => {
		setCurrentAction('delete');
		setShowConfirmModal(true);
	};

	const showConfirmWarningHandler = () => {
		setCurrentAction('confirm');
		setShowConfirmModal(true);
	};

	const cancelHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmHandler = async () => {
		setShowConfirmModal(false);
		try {
			if (currentAction === 'delete') {
				await sendRequest(`http://localhost:3003/stories/${id}`, 'DELETE', null, {
					Authorization: 'Bearer ' + auth.token,
				});
				onDelete(id);
			} else if (currentAction === 'confirm') {
				await sendRequest(
					`http://localhost:3003/stories/${id}/approve`,
					'PUT',
					{ is_approved: true },
					{
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + auth.token,
					}
				);
			}
		} catch (err) {}
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showConfirmModal}
				onCancel={cancelHandler}
				header={currentAction === 'delete' ? 'Are you sure?' : 'Confirm the story'}
				footerClass='story-item__modal-actions'
				footer={
					<>
						<Button inverse onClick={cancelHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmHandler}>
							{currentAction === 'delete' ? 'DELETE' : 'CONFIRM'}
						</Button>
					</>
				}>
				<p>
					{currentAction === 'delete'
						? 'Do you want to proceed and delete this story?'
						: 'Do you want to confirm this story?'}
				</p>
			</Modal>
			<li className='story-item'>
				<Card className='story-item__content'>
					{isLoading && <LoadingSpinner asOverlay />}
					<div className='story-item__image'>
						<img
							src={image ? `http://localhost:3003/${image}` : storyImg}
							alt={title}
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = storyImg;
							}}
						/>
					</div>
					<div className='story-item__info'>
						<h2>{title}</h2>
						<p className='truncate-description'>{truncateDescription(description, 20)}</p>
						<div className='story-item__sum'>
							<h3>{current_amount}</h3>
							<h3>{goal_amount}</h3>
						</div>
					</div>
					<div>
						<ProgressBar currentAmount={current_amount} goalAmount={goal_amount} />
					</div>
					<div className='story-item__actions'>
						{auth.userType === 'admin' && (
							<div>
								<div>
									<Button onClick={showConfirmWarningHandler}>CONFIRM</Button>
									<Button danger onClick={showDeleteWarningHandler}>
										DELETE
									</Button>
								</div>
							</div>
						)}
					</div>
				</Card>
			</li>
		</>
	);
};
export default StoryItem;
