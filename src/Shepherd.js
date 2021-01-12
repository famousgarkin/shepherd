import React from 'react'
import $ from 'jquery'

import ItemFactory from './ItemFactory'

export default class Shepherd extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			itemFactory: new ItemFactory(props.config.items),

			title: props.config.title,
			navigation: [],
			url: null,

			frameWidth: null,
			frameHeight: null,
		}
		this.navigate = this.navigate.bind(this)
		this.spanFrame = this.spanFrame.bind(this)
		this.frame = React.createRef()
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

	spanFrame() {
		// TODO: handle frame spanning without jQuery?
		var $window = $(window)
		var $frame = $(this.frame.current)

		this.setState({
			frameWidth: $window.width() - $frame.offset().left,
			frameHeight: $window.height() - $frame.offset().top,
		})
	}

	componentDidMount() {
		this.navigate()
		window.addEventListener('hashchange', this.navigate)

		// delay initial frame resize until rendered properly
		setTimeout(
			function () {
				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(this.spanFrame)
				} else {
					this.spanFrame()
				}
			}.bind(this),
			0,
		)
		window.addEventListener('resize', this.spanFrame)
	}

	render() {
		document.title = this.state.title
		return (
			<div>
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

				<iframe
					ref={this.frame}
					src={this.state.url}
					frameBorder="0"
					width={this.state.frameWidth}
					height={this.state.frameHeight}
				></iframe>
			</div>
		)
	}
}
