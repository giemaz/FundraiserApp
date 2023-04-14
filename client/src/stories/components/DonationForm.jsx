// client\src\stories\components\DonationForm.jsx
import React, { useState } from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE, VALIDATOR_NUMBER, VALIDATOR_INTEGER, VALIDATOR_MIN } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Modal from '../../shared/components/UIElements/Modal';

const DonationForm = ({ storyId, onDonationSuccess, isGoalReached }) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const [formState, inputHandler] = useForm(
		{
			donor_name: {
				value: '',
				isValid: false,
			},
			donation_amount: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const showConfirmModalHandler = () => {
		setShowConfirmModal(true);
	};

	const cancelConfirmModalHandler = () => {
		setShowConfirmModal(false);
	};

	const donationSubmitHandler = (event) => {
		event.preventDefault();
		showConfirmModalHandler();
	};

	const confirmDonationHandler = async (event) => {
		event.preventDefault();
		try {
			const donationData = {
				donor_name: formState.inputs.donor_name.value,
				donation_amount: parseInt(formState.inputs.donation_amount.value, 10),
			};
			await sendRequest(`http://localhost:3003/stories/${storyId}/donations`, 'POST', donationData, {
				'Content-Type': 'application/json',
			});
			onDonationSuccess();
			cancelConfirmModalHandler();
		} catch (err) {}
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<Modal
				show={showConfirmModal}
				onCancel={cancelConfirmModalHandler}
				header='Confirm your donation'
				footerClass='donation-form__modal-actions'
				footer={
					<>
						<Button inverse onClick={cancelConfirmModalHandler}>
							CANCEL
						</Button>
						<Button onClick={confirmDonationHandler}>DONATE</Button>
					</>
				}>
				<p>Do you want to proceed and make this donation?</p>
			</Modal>
			<form className='story-form' onSubmit={donationSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id='donor_name'
					element='input'
					type='text'
					label='Name'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid title.'
					onInput={inputHandler}
				/>
				<Input
					id='donation_amount'
					element='input'
					type='number'
					label='Donation'
					validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER(), VALIDATOR_INTEGER(), VALIDATOR_MIN(1)]}
					errorText='Please enter a valid sum.'
					onInput={inputHandler}
				/>
				<Button type='submit' disabled={!formState.isValid || isGoalReached}>
					DONATE
				</Button>
			</form>
		</>
	);
};

export default DonationForm;
