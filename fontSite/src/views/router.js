import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Home from './Home';
import Search from './Search';
import Detail from './Detail';

const router = () => (
	<section className="content">
		<Route exact path="/" render={() => (<Redirect to="/search" />)} />
		<Route exact path="/search" component={Search} />
		<Route exact path="/detail/:id" component={Detail} />
	</section>
);

export default router;
