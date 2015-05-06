module('title', {
    afterEach: function() {
        App.reset()
    },
})

test('TitleHandler._titleFactory', function(assert) {
    var handler = Ember.Object.createWithMixins(App.TitleHandler)
    assert.equal(handler._titleFactory('test'), 'test - Shepherd')
    assert.equal(handler._titleFactory(), 'Shepherd')
})

test('document title on initial page load is set correctly', function(assert) {
    document.title = 'test'
    visit('/')
    andThen(function() {
        assert.equal(document.title, 'Readme - Shepherd')
    })
})
