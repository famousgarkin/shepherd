module('items', {
    afterEach: function() {
        App.reset()
    },
})

test('ItemFactory._getItemId', function(assert) {
    var factory = Ember.Object.createWithMixins(App.ItemFactory)
    assert.ok(factory._getItemId('some  page  ') === 'some-page')
    assert.ok(factory._getItemId('some\tpage\t') === 'some-page')
    assert.ok(factory._getItemId('some\npage\n') === 'some-page')
    assert.ok(factory._getItemId('some??page??') === 'some-page')
    assert.ok(factory._getItemId('some//page//') === 'some-page')
    assert.ok(factory._getItemId('some\\\\page\\\\') === 'some-page')
})

test('ItemFactory._getItemIdPath', function(assert) {
    var factory = Ember.Object.createWithMixins(App.ItemFactory)
    assert.ok(factory._getItemIdPath('some', 'page') === 'some/page')
    assert.ok(factory._getItemIdPath('some', 'page/1/2') === 'some/page/1/2')
    assert.ok(factory._getItemIdPath('some', '') === 'some')
    assert.ok(factory._getItemIdPath('some', null) === 'some')
    assert.ok(factory._getItemIdPath('some', undefined) === 'some')
})

test('ItemFactory._ensureItemIds', function(assert) {
    var configItems = [
        {name: 'page 1', url: 'url-1', items: [
            {name: 'page 11', url: 'url-11'},
            {name: 'page 12', url: 'url-12', items: [
                {name: 'page 111', url: 'url-111'},
                {name: 'page 112', url: 'url-112'},
            ]},
        ]},
        {name: 'page 2', url: 'url-2', items: [
            {name: 'page 21', url: 'url-21'},
            {name: 'page 22', url: 'url-22'},
        ]},
        {name: 'page 3', url: 'url-3'},
    ]
    var factory = Ember.Object.createWithMixins(App.ItemFactory)
    var items = factory._getItems(configItems)
    assert.ok(items !== configItems)
    assert.notOk(configItems[0].hasOwnProperty('id'))
    assert.ok(items[0].hasOwnProperty('id'))
    assert.ok(items[0].items[1].items[1].hasOwnProperty('id'))
    assert.ok(items[1].hasOwnProperty('id'))
    assert.ok(items[1].items[0].hasOwnProperty('id'))
    assert.ok(items[2].hasOwnProperty('id'))
})
