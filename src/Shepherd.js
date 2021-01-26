import React from 'react'

import ItemFactory from './ItemFactory'

export default class Shepherd extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			itemFactory: new ItemFactory(props.config.items),

			title: props.config.title,
			navigation: [],
			url: null,
		}
		this.navigate = this.navigate.bind(this)
	}

	navigate() {
		var location = window.location.hash.substr(2)
		var item = this.state.itemFactory.getItem(location)

		// handle nonexistent route
		if (!item) {
			window.location.hash = '#/'
			return
		}

		this.setState({
			title: [item.title, this.props.config.title].join(' - '),
			navigation: item.navigation,
			url: item.url,
		})
	}

	componentDidMount() {
		this.navigate()
		window.addEventListener('hashchange', this.navigate)
	}

	render() {
		document.title = this.state.title
		return (
			<div className="shepherd-container">
				<div className="shepherd-tabs">
					{this.state.navigation.map(function (item, i) {
						return (
							<ul key={i} className="nav nav-tabs">
								{item.map(function (item, i) {
									return (
										<li key={i} className="nav-item">
											<a
												className={item.active ? 'nav-link active' : 'nav-link'}
												href={'#/' + item.idPath}
											>
												{item.name}
											</a>
										</li>
									)
								})}
							</ul>
						)
					})}
				</div>
				<iframe className="shepherd-frame" src={this.state.url} frameBorder="0"></iframe>
			</div>
		)
	}
}
