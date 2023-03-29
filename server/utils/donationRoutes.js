// server\utils\donationRoutes.js
const express = require('express');
const connection = require('../db');
const router = express.Router();

//GET
router.get('/stories/:story_id/donations', (req, res) => {
	const { story_id } = req.params;

	connection.query('SELECT * FROM donations WHERE story_id = ?', [story_id], (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).send('Server error');
			return;
		}

		res.send(results);
	});
});

// POST
router.post('/stories/:story_id/donations', (req, res) => {
	const { story_id } = req.params;
	const { donor_name, donation_amount } = req.body;

	if (!donor_name || !donation_amount) {
		res.status(400).send('Invalid request');
		return;
	}

	const newDonation = { story_id, donor_name, donation_amount };
	connection.query('INSERT INTO donations SET ?', newDonation, (err, results) => {
		if (err) {
			console.error(err);
			res.status(500).send('Server error');
			return;
		}

		newDonation.id = results.insertId;
		res.status(201).send(newDonation);
	});
});

module.exports = { router };
