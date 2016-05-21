module('title', {
	afterEach: function() {
		App.reset()
	},
})

test('document title on initial page load is set correctly', function(assert) {
	document.title = 'test'
	visit('/')
	andThen(function() {
		assert.equal(document.title, 'Readme - Shepherd')
	})
})
