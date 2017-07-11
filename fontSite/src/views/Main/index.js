import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';

import { appInit } from 'actions/app';

import Router from '../router';

import styles from './index.scss';

class Main extends React.Component {
	componentWillMount() {
		const { dispatch } = this.props;
		dispatch(appInit());
	}

	render() {
		return (
			<div className="wrapper">
				<header className="main-header">
					<Link to="/" className="logo">
						<span className="logo-mini" />
						<span className="logo-lg">Offline</span>
					</Link>
					<nav className="navbar navbar-static-top">
						<a className="sidebar-toggle" data-toggle="offcanvas" role="button">
							<span className="sr-only">Toggle navigation</span>
						</a>
					</nav>
				</header>
				<aside className="main-sidebar">
					<section className="sidebar">
						<ul className="sidebar-menu tree" data-widget="tree">
							<li className="header">MAIN NAVIGATION</li>
							<li><Link to="/"><i className="fa fa-home" /> <span>Home</span></Link></li>
						</ul>
					</section>
				</aside>
				<div className="content-wrapper">
					<Router />
				</div>
				<footer className="main-footer clearfix">
					<div className="pull-right hidden-xs" />
				</footer>
			</div>
		);
	}
}

Main.propTypes = {
	dispatch: PropTypes.func,
};

export default withRouter(connect()(cssModules(Main, styles)));
