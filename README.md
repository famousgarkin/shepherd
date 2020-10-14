# Shepherd

> Herd the scattered and disparate tools and pages under a common interface.

Shepherd is a single-page application with a configurable hierarchical tabbed navigation that loads pages inside itself in an `iframe`.

It is but to scratch an itch with a load of dangling intranet pages that needed consolidation.

![](assets/shepherd.png)

![](assets/example.png)

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

* Host as static website
