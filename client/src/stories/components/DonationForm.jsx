// client\src\stories\components\DonationForm.jsx
import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

const DonationForm = ({ storyId, onDonationSuccess }) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
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

	const placeSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			const donationData = {
				donor_name: formState.inputs.donor_name.value,
				donation_amount: parseInt(formState.inputs.donation_amount.value, 10),
			};
			await sendRequest(
				// `http://localhost:3003/test`,
				`http://localhost:3003/stories/${storyId}/donations`,
				'POST',
				donationData,
				{
					'Content-Type': 'application/json',
				}
			);
			onDonationSuccess();
		} catch (err) {}
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<form className='story-form' onSubmit={placeSubmitHandler}>
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
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid sum.'
					onInput={inputHandler}
				/>
				<Button type='submit' disabled={!formState.isValid}>
					DONATE
				</Button>
			</form>
		</>
	);
};

export default DonationForm;
