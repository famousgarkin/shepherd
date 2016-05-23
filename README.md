# Shepherd

[![build status](https://travis-ci.org/famousgarkin/shepherd.svg)](https://travis-ci.org/famousgarkin/shepherd)

> Herd the scattered, disparate, legacy tools and pages under a common interface.

Shepherd is a single-page application without a backend that provides a configurable hierarchical tabbed navigation and loads target URLs inside an `iframe`.

It is but to scratch an itch with a load of dangling intranet endpoints that needed consolidation.

![](assets/shepherd.png)

## Usage

* Configure via `config.js`:
	```js
	var config = {
		title: 'Shepherd',
		items: [
			{name: 'Shepherd', items: [
				{name: 'Readme', url: './README.md'},
				{name: 'Config', url: './config.js'},
				{name: 'CSS', url: './shepherd.css'},
			]},
			{name: 'Example.com', url: 'https://example.com'},
		],
	}
	```
* Host as a static website
