// client\src\pages\Create.jsx
import React, { useContext } from 'react';

import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import ErrorModal from '../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../shared/components/FormElements/ImageUpload';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../shared/util/validators';
import { useForm } from '../shared/hooks/form-hook';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';

import './Create.css';

const Create = () => {
	const auth = useContext(AuthContext);
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [formState, inputHandler] = useForm(
		{
			title: {
				value: '',
				isValid: false,
			},
			description: {
				value: '',
				isValid: false,
			},
			goal_amount: {
				value: '',
				isValid: false,
			},
			image: {
				value: null,
				isValid: false,
			},
		},
		false
	);

	const placeSubmitHandler = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData();
			formData.append('title', formState.inputs.title.value);
			formData.append('description', formState.inputs.description.value);
			formData.append('goal_amount', formState.inputs.goal_amount.value);
			formData.append('image', formState.inputs.image.value);
			await sendRequest('http://localhost:3003/stories', 'POST', formData, {
				Authorization: 'Bearer ' + auth.token,
			});
		} catch (err) {}
	};

	return (
		<>
			<ErrorModal error={error} onClear={clearError} />
			<form className='story-form' onSubmit={placeSubmitHandler}>
				{isLoading && <LoadingSpinner asOverlay />}
				<Input
					id='title'
					element='input'
					type='text'
					label='Title'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid title.'
					onInput={inputHandler}
				/>
				<Input
					id='description'
					element='textarea'
					label='Description'
					validators={[VALIDATOR_MINLENGTH(5)]}
					errorText='Please enter a valid description (at least 5 characters).'
					onInput={inputHandler}
				/>
				<Input
					id='goal_amount'
					element='input'
					type='number'
					label='Goal'
					validators={[VALIDATOR_REQUIRE()]}
					errorText='Please enter a valid data.'
					onInput={inputHandler}
				/>
				<ImageUpload id='image' onInput={inputHandler} errorText='Please provide an image.' />
				<Button type='submit' disabled={!formState.isValid}>
					ADD STORY
				</Button>
			</form>
		</>
	);
};

export default Create;
