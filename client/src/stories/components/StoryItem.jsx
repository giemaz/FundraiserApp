import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ProgressBar from '../../shared/components/UIElements/ProgressBar';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './StoryItem.css';

const PlaceItem = ({ id, onDelete, title, description, image, goal_amount, current_amount, creatorId }) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const auth = useContext(AuthContext);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const showDeleteWarningHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelDeleteHandler = () => {
		setShowConfirmModal(false);
	};

	const confirmDeleteHandler = async () => {
		setShowConfirmModal(false);
		try {
			await sendRequest(`http://localhost:3003/stories/${id}`, 'DELETE', null, {
				Authorization: 'Bearer ' + auth.token,
			});
			onDelete(id);
		} catch (err) {}
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showConfirmModal}
				onCancel={cancelDeleteHandler}
				header='Are you sure?'
				footerClass='story-item__modal-actions'
				footer={
					<>
						<Button inverse onClick={cancelDeleteHandler}>
							CANCEL
						</Button>
						<Button danger onClick={confirmDeleteHandler}>
							DELETE
						</Button>
					</>
				}>
				<p>Do you want to proceed and delete this story? Please note that it can't be undone thereafter.</p>
			</Modal>
			<li className='story-item'>
				<Card className='story-item__content'>
					{isLoading && <LoadingSpinner asOverlay />}
					<div className='story-item__image'>
						<img src={`http://localhost:3003/${image}`} alt={title} />
					</div>
					<div className='story-item__info'>
						<h2>{title}</h2>
						<h3>{goal_amount}</h3>
						<p>{description}</p>
					</div>
					<div>
						<ProgressBar currentAmount={current_amount} goalAmount={goal_amount} />
					</div>
					<div className='story-item__actions'>
						{auth.userId === creatorId && (
							<Button danger onClick={showDeleteWarningHandler}>
								DELETE
							</Button>
						)}
					</div>
				</Card>
			</li>
		</>
	);
};

export default PlaceItem;
