// client\src\shared\components\DonationForm\DonationForm.jsx
import React from 'react';

import Input from '../FormElements/Input';
import Button from '../FormElements/Button';
import ErrorModal from '../UIElements/ErrorModal';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from '../../util/validators';
import { useForm } from '../../hooks/form-hook';
import { useHttpClient } from '../../hooks/http-hook';

const DonationForm = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm(
		{
			donor_name: {
				value: '',
				isValid: false,
			},
			goal_amount: {
				value: '',
				isValid: false,
			},
		},
		false
	);

	const placeSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData();
			formData.append('donor_name	', formState.inputs.donor_name.value);
			formData.append('donation_amount', formState.inputs.donation_amount.value);
			await sendRequest('http://localhost:3003/stories/:story_id/donations', 'POST', formData, {});
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
					errorText='Please enter a valid data.'
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
