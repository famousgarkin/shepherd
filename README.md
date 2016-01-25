# Shepherd

[![build status](https://travis-ci.org/famousgarkin/shepherd.svg)](https://travis-ci.org/famousgarkin/shepherd)

> Herd the scattered, disparate, legacy tools and pages under a common interface.

Shepherd is a single-page application without a backend that provides a configurable hierarchical tabbed navigation and loads target URLs inside an `iframe`.

It is but to scratch an itch with a load of dangling intranet endpoints that needed consolidation.

![](assets/shepherd.png)

## Usage

1. Set *title* and navigation *items* in `config.js`:

	```js
	var config = {}
	
	config.title = 'Shepherd'
	
	config.items = [
		{name: 'Readme', url: 'README.md'},
		{name: 'Sample', url: 'sample', items: [
			{name: 'Sample 1', url: 'sample-content-1'},
			{name: 'Sample 2', url: 'sample-content-2', items: [
				{name: 'Sample 2.1', url: 'sample-content-2.1'},
				{name: 'Sample 2.2', url: 'sample-content-2.2'},
			]},
		]},
	]
	```

2. Host as a static website

3. Optionally override CSS via `custom.css`
