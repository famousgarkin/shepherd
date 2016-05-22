var Item = require('../src/Item')

describe('Item', function () {
	describe('_getId', function () {
		it('gets ID from name', function () {
			expect(Item._getId('some  page  ')).toBe('some-page')
			expect(Item._getId('some\tpage\t')).toBe('some-page')
			expect(Item._getId('some\npage\n')).toBe('some-page')
			expect(Item._getId('some??page??')).toBe('some-page')
			expect(Item._getId('some//page//')).toBe('some-page')
			expect(Item._getId('some\\\\page\\\\')).toBe('some-page')
		})
	})
	
	describe('_getItemIdPath', function() {
		it('gets ID path from ID and parent ID path', function () {
			expect(Item._getIdPath('some', 'page')).toBe('page/some')
			expect(Item._getIdPath('some', 'page/1/2')).toBe('page/1/2/some')
			expect(Item._getIdPath('some', '')).toBe('some')
			expect(Item._getIdPath('some', null)).toBe('some')
			expect(Item._getIdPath('some', undefined)).toBe('some')
		})
	})
})
