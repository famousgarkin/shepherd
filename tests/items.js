module('items', {
	afterEach: function() {
		App.reset()
	},
})

test('Shepherd.Item._getId', function (assert) {
	assert.equal(Shepherd.Item._getId('some  page  '), 'some-page')
	assert.equal(Shepherd.Item._getId('some\tpage\t'), 'some-page')
	assert.equal(Shepherd.Item._getId('some\npage\n'), 'some-page')
	assert.equal(Shepherd.Item._getId('some??page??'), 'some-page')
	assert.equal(Shepherd.Item._getId('some//page//'), 'some-page')
	assert.equal(Shepherd.Item._getId('some\\\\page\\\\'), 'some-page')
})

test('Shepherd.ItemFactory._getItemIdPath', function(assert) {
	assert.equal(Shepherd.Item._getIdPath('some', 'page'), 'page/some')
	assert.equal(Shepherd.Item._getIdPath('some', 'page/1/2'), 'page/1/2/some')
	assert.equal(Shepherd.Item._getIdPath('some', ''), 'some')
	assert.equal(Shepherd.Item._getIdPath('some', null), 'some')
	assert.equal(Shepherd.Item._getIdPath('some', undefined), 'some')
})


test('Shepherd.ItemFactory get item IDs from ID path', function(assert) {
	assert.deepEqual(''.split('/'), [''])
	assert.deepEqual('/'.split('/'), ['', ''])
	assert.deepEqual('some/page'.split('/'), ['some', 'page'])
})

test('Shepherd.ItemFactory._getItems', function(assert) {
	var configItems = [
		{name: 'page 1', url: 'url-1', items: [
			{name: 'page 11', url: 'url-11'},
			{name: 'page 12', url: 'url-12', items: [
				{name: 'page 121', url: 'url-121'},
				{name: 'page 122', url: 'url-122'},
			]},
		]},
		{name: 'page 2', url: 'url-2', items: [
			{name: 'page 21', url: 'url-21'},
			{name: 'page 22', url: 'url-22'},
		]},
		{name: 'page 3', url: 'url-3'},
	]
	var factory = new Shepherd.ItemFactory(configItems)
	var items = factory._getItems()
	assert.ok(items !== configItems)
	assert.notOk(configItems[0].hasOwnProperty('id'))
	assert.equal(items[0].id, 'page-1')
	assert.equal(items[0].idPath, 'page-1')
	assert.equal(items[0].items[1].items[1].id, 'page-122')
	assert.equal(items[0].items[1].items[1].idPath, 'page-1/page-12/page-122')
	assert.ok(items[1].hasOwnProperty('id'))
	assert.ok(items[1].items[0].hasOwnProperty('id'))
	assert.ok(items[1].items[0].hasOwnProperty('idPath'))
	assert.ok(items[2].hasOwnProperty('id'))
})

test('Shepherd.ItemFactory.getItem', function(assert) {
	var configItems = [
		{name: 'Page 1', url: 'url-1', items: [
			{name: 'Page 11', url: 'url-11'},
			{name: 'Page 12', url: 'url-12', items: [
				{name: 'Page 121', url: 'url-121'},
				{name: 'Page 122', url: 'url-122'},
			]},
		]},
		{name: 'Page 2', url: 'url-2', items: [
			{name: 'Page 21', url: 'url-21'},
			{name: 'Page 22', url: 'url-22'},
		]},
		{name: 'Page 3', url: 'url-3'},
	]
	var factory = new Shepherd.ItemFactory(configItems)
	assert.equal(factory.getItem('/'), undefined)
	assert.equal(factory.getItem('nonexistent-id-path'), undefined)
	assert.equal(factory.getItem('nonexistent/id/path'), undefined)
	assert.equal(factory.getItem('').url, 'url-11')
	assert.equal(factory.getItem('page-1').url, 'url-11')
	assert.equal(factory.getItem('page-1/page-12').url, 'url-121')
	var item = factory.getItem('page-1/page-12/page-122')
	assert.equal(item.title, 'Page 122 - Page 12 - Page 1')
	assert.equal(item.url, 'url-122')
	assert.equal(item.navigation.length, 3)
})
