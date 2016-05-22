var React = require('react')
var ReactDOM = require('react-dom')

var Shepherd = require('./Shepherd')

ReactDOM.render(
	<Shepherd config={global.config}/>,
	document.getElementById('shepherd')
)
