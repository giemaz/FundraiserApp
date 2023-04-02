// client\src\shared\components\Donation\Donation.jsx
import React from 'react';

const Donation = ({ donor_name, donation_amount }) => {
	return (
		<li>
			<strong>{donor_name}</strong> donated {donation_amount}€
		</li>
	);
};

export default Donation;
