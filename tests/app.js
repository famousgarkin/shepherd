module('routing', {
	afterEach: function() {
		App.reset()
	},
})

test('everything routes to item resource', function(assert) {
	var check = function(url) {
		visit(url)
		andThen(function() {
			assert.equal(currentPath(), 'item')
		})
	}
	check('/')
	check('/readme')
	check('/nonexistent-ID-path')
	check('/nonexistent/ID/path')
})

test('nonexistent ID path redirects to no ID path', function(assert) {
	var check = function(url) {
		visit(url)
		andThen(function() {
			assert.equal(currentURL(), '/')
		})
	}
	check('/nonexistent-ID-path')
	check('/nonexistent/ID/path')
})

test('document title on initial page load is set correctly', function(assert) {
	document.title = 'test'
	visit('/')
	andThen(function() {
		assert.equal(document.title, 'Readme - Shepherd')
	})
})
