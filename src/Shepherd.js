var React = require('react')

var ItemFactory = require('./ItemFactory')

var Shepherd = React.createClass({
	getInitialState: function () {
		return {
			itemFactory: new ItemFactory(this.props.config.items),

			title: this.props.config.title,
			navigation: [],
			url: null,

			frameWidth: null,
			frameHeight: null,
		}
	},

	navigate: function () {
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
	},

	spanFrame: function() {
		// TODO: handle frame spanning without jQuery?
		var $window = $(window)
		var $frame = $(this.refs.frame)

		this.setState({
			frameWidth: $window.width() - $frame.offset().left,
			frameHeight: $window.height() - $frame.offset().top,
		})
	},

	componentDidMount: function () {
		this.navigate()
		window.addEventListener('hashchange', this.navigate)

		// delay resize until rendered properly
		setTimeout(this.spanFrame, 0)
		window.addEventListener('resize', this.spanFrame)
	},

	render: function () {
		document.title = this.state.title
		return (
			<div>
				{this.state.navigation.map(function (item, i) {
					return (
						<ul key={i} className="nav nav-tabs">
							{item.map(function (item, i) {
								return (
									<li key={i} className={item.active ? 'active' : ''}>
										<a href={'#/' + item.idPath}>{item.name}</a>
									</li>
								)
							})}
						</ul>
					)
				})}

				<iframe ref="frame" src={this.state.url} frameborder="0" width={this.state.frameWidth} height={this.state.frameHeight}>
				</iframe>
			</div>
		)
	},
})
module.exports = Shepherd
