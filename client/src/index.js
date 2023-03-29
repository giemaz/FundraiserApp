// bank-page\src\index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './shared/context/Routing';
import './index.css';
import App from './App';
import { AuthProvider } from './shared/context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<AuthProvider>
		<Router>
			<App />
		</Router>
	</AuthProvider>
);
