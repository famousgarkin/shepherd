module('items', {
    afterEach: function() {
        App.reset()
    },
})

test('ItemFactory._getItemId', function(assert) {
    var factory = Ember.Object.createWithMixins(App.ItemFactory)
    assert.equal(factory._getItemId('some  page  '), 'some-page')
    assert.equal(factory._getItemId('some\tpage\t'), 'some-page')
    assert.equal(factory._getItemId('some\npage\n'), 'some-page')
    assert.equal(factory._getItemId('some??page??'), 'some-page')
    assert.equal(factory._getItemId('some//page//'), 'some-page')
    assert.equal(factory._getItemId('some\\\\page\\\\'), 'some-page')
})

test('ItemFactory._getItemIds', function(assert) {
    var factory = Ember.Object.createWithMixins(App.ItemFactory)
    assert.deepEqual(factory._getItemIds(''), [''])
    assert.deepEqual(factory._getItemIds('/'), ['', ''])
    assert.deepEqual(factory._getItemIds('some/page'), ['some', 'page'])
})

test('ItemFactory._getItemIdPath', function(assert) {
    var factory = Ember.Object.createWithMixins(App.ItemFactory)
    assert.equal(factory._getItemIdPath('some', 'page'), 'page/some')
    assert.equal(factory._getItemIdPath('some', 'page/1/2'), 'page/1/2/some')
    assert.equal(factory._getItemIdPath('some', ''), 'some')
    assert.equal(factory._getItemIdPath('some', null), 'some')
    assert.equal(factory._getItemIdPath('some', undefined), 'some')
})

test('ItemFactory.getItems', function(assert) {
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
    var factory = Ember.Object.createWithMixins(App.ItemFactory)
    var items = factory.getItems(configItems)
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

test('ItemFactory.getItem', function(assert) {
    var items = [
        {id: 'page-1', idPath: 'page-1', url: 'url-1', items: [
            {id: 'page-11', url: 'url-11'},
            {id: 'page-12', url: 'url-12', items: [
                {id: 'page-121', url: 'url-121'},
                {id: 'page-122', url: 'url-122'},
            ]},
        ]},
        {id: 'page-2', url: 'url-2', items: [
            {id: 'page-21', url: 'url-21'},
            {id: 'page-22', url: 'url-22'},
        ]},
        {id: 'page-3', url: 'url-3'},
    ]
    var factory = Ember.Object.createWithMixins(App.ItemFactory)
    var getItem = function(idPath) {
        return factory.getItem(items, idPath)
    }
    assert.equal(getItem('/'), undefined)
    assert.equal(getItem('nonexistent-id-path'), undefined)
    assert.equal(getItem('nonexistent/id/path'), undefined)
    assert.equal(getItem('').url, 'url-11')
    assert.equal(getItem('page-1').url, 'url-11')
    assert.equal(getItem('page-1/page-12').url, 'url-121')
    var item = getItem('page-1/page-12/page-122')
    assert.equal(item.url, 'url-122')
    assert.equal(item.navigation.length, 3)
})
