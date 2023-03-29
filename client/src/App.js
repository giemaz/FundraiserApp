// bank-page\src\App.js
import { useContext } from 'react';
import Home from './pages/Home';
import { pagesMapping, RoutingContext } from './context/Routing';
import MainNavigation from './shared/components/Navigation/MainNavigation';

function App() {
	const { page } = useContext(RoutingContext);

	return (
		<div className='container'>
			<MainNavigation />
			<div style={{ marginTop: '50px' }}>{pagesMapping.home === page && <Home />}</div>
		</div>
	);
}

export default App;
