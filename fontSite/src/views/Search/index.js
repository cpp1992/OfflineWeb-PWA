import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, StateForm, StateFormField, SearchInput, LoadingIcon } from 'bdp-components';
import cssModules from 'react-css-modules';

import { Subject } from 'utils/rxUtils';

import styles from './index.scss';

class Search extends React.Component {
	constructor() {
		super();
		this.state = {
			search: '',
			loading: false,
			list: [],
		};

		this.subject = new Subject();

		this.subject
			.filter(value => !value)
			.subscribe(() => {
				this.setState({ loading: false, list: [] });
			});

		this.subject
			.filter(value => value)
			.do(() => {
				this.setState({ loading: true });
			}).latestPromise(value => fetch(`/api/item/list?search=${value}`).then(res => res.json()))
			.subscribe((list) => {
				this.setState({ loading: false, list });
			});
	}

	onChange = ({ target: { value } }) => {
		const { history } = this.props;
		history.push(`/search?${value}`);
		this.subject.next(value);
	};

	render() {
		const { loading, list } = this.state;
		const { online, pwa_list } = this.props;

		let $view;
		if (online) {
			const $title = (
				<span>
				Search Items{' '}
					{loading && <LoadingIcon />}
			</span>
			);

			$view = (
				<Box title={$title}>
					<StateForm instance={this}>
						<StateFormField
							name="search" component={SearchInput} delay="100" placeholder="input item name..."
							onChange={this.onChange}
						/>
					</StateForm>

					<ul className="list-unstyled">
						{list.map(({ id, name, description, price, image }, index) => (
							<li key={index} styleName="list-item">
								<Link to={`/detail/${id}`} className="clearfix">
									<div styleName="preview">
										<img src={image} alt={name} />
									</div>
									<div styleName="content">
										<h3>{name}</h3>
										<span styleName="price">{price}</span>
										<p>{description}</p>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</Box>
			);
		} else {
			$view = (
				<Box title="Offline Mode">
					<p>{'It seems your currently can\'t access network. We\'ll provide offline service for your visit history.'}</p>
					<ul className="list-unstyled">
						{pwa_list.map(({ id, name, description, price, image }, index) => (
							<li key={index} styleName="list-item">
								<Link to={`/detail/${id}`} className="clearfix">
									<div styleName="preview">
										<img src={image} alt={name} />
									</div>
									<div styleName="content">
										<h3>{name}</h3>
										<span styleName="price">{price}</span>
										<p>{description}</p>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</Box>
			);
		}

		return (
			<div>
				{$view}
			</div>
		);
	}
}

Search.propTypes = {
	online: PropTypes.bool,
	pwa_list: PropTypes.array,
};

const mapProps = ({ app: { online, pwa_list } }) => ({
	pwa_list,
	online,
});

export default connect(mapProps)(cssModules(Search, styles));
