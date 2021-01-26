import '@patternfly/patternfly/patternfly.css'
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import Shepherd from './Shepherd'

// prettier-ignore
ReactDOM.render(
	<Shepherd config={global.shepherdConfig} />,
	document.getElementById('shepherdRoot')
)
