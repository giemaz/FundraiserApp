// bank-page\src\context\Routing.js
import React, { useState, useMemo } from 'react';

export const pagesMapping = {
	home: 'Home',
	create: 'Create',
	admin: 'Admin',
};

export const RoutingContext = React.createContext({ page: pagesMapping.home });

export default function Router({ children }) {
	let urlPath = window.location.pathname.slice(1).toLowerCase();
	const [page, setPage] = useState(urlPath || pagesMapping.home);

	const value = useMemo(() => ({ page, setPage }), [page, setPage]);

	return <RoutingContext.Provider value={value}>{children}</RoutingContext.Provider>;
}
