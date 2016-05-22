var Shepherd = Shepherd || {}

Shepherd.config = {
	title: 'Shepherd',
	items: [
		{name: 'Readme', url: 'README.md'},
		{name: 'Sample', url: 'sample', items: [
			{name: 'Sample 1', url: 'sample-content-1'},
			{name: 'Sample 2', url: 'sample-content-2', items: [
				{name: 'Sample 2.1', url: 'sample-content-2.1'},
				{name: 'Sample 2.2', url: 'sample-content-2.2'},
			]},
		]},
	],
}
