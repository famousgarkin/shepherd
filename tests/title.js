module('title', {
	afterEach: function() {
		App.reset()
	},
})

test('Shepherd.titleFactory', function(assert) {
	assert.equal(Shepherd.titleFactory('test'), 'test - Shepherd')
	assert.equal(Shepherd.titleFactory(), 'Shepherd')
})

test('document title on initial page load is set correctly', function(assert) {
	document.title = 'test'
	visit('/')
	andThen(function() {
		assert.equal(document.title, 'Readme - Shepherd')
	})
})
