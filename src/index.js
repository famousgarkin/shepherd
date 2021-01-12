import React from 'react'
import ReactDOM from 'react-dom'

import Shepherd from './Shepherd'

// prettier-ignore
ReactDOM.render(
	<Shepherd config={global.config} />,
	document.getElementById('shepherd')
)
