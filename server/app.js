test;
test;
// server\app.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('./utils/middleware');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());
const port = 3003;

const { router: authRoutes } = require('./utils/authRoutes');
const accountsRoutes = require('./utils/accountsRoutes')(authenticateJWT);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(authRoutes);
app.use(accountsRoutes);

app.listen(port, () => {
	console.log(`LN is on port number: ${port}`);
});

module.exports = { authenticateJWT };
