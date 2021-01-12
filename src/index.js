import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import Shepherd from './Shepherd'

// prettier-ignore
ReactDOM.render(
	<Shepherd config={global.shepherdConfig} />,
	document.getElementById('shepherdRoot')
)
