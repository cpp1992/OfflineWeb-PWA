import React from 'react';
import PropTypes from 'prop-types';
import { Button, StateForm, StateFormField } from 'bdp-components';
import { connect } from 'react-redux';
import cssModules from 'react-css-modules';

import styles from './index.scss';

class Detail extends React.Component {
	constructor() {
		super();
		this.state = {
			item: {},
			quantity: '1',
		};
	}

	componentWillMount() {
		const { match: { params: { id } } } = this.props;
		fetch(`/api/item/${id}`)
			.then(res => res.json())
			.then((item) => {
				this.setState({ item });
			});
	}

	render() {
		const { name, description, price, image } = this.state.item;
		const { online } = this.props;

		let $operation;
		if (online) {
			$operation = (
				<td>
					<Button type="primary">Buy It Now</Button>
					<Button type="info">Add to Cart</Button>
				</td>
			);
		} else {
			$operation = (
				<td>
					<Button disabled>You Are Now Offline</Button>
				</td>
			);
		}

		return (
			<StateForm instance={this}>
				<div className="row" styleName="detail">
					<div className="col-sm-4">
						<div styleName="preview">
							<img src={image} alt={name} />
						</div>
					</div>
					<div className="col-sm-8" styleName="content">
						<h1>{name}</h1>
						<p>{description}</p>
						<table styleName="table">
							<tbody>
								<tr>
									<th width="100">Price</th>
									<td styleName="strong">{price}</td>
								</tr>
								<tr>
									<th>Quantity</th>
									<td>
										<StateFormField name="quantity" type="number" displayName="" min="1" />
									</td>
								</tr>
								<tr>
									<th />
									{$operation}
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</StateForm>
		);
	}
}

Detail.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.object,
	}),
	online: PropTypes.bool,
};

const mapState = ({ app: { online } }) => ({
	online,
});

export default connect(mapState)(cssModules(Detail, styles));
