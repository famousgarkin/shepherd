import ItemFactory from '../src/ItemFactory'

describe('ItemFactory', function () {
	it('splits ID path to item IDs', function () {
		expect(''.split('/')).toEqual([''])
		expect('/'.split('/')).toEqual(['', ''])
		expect('some/page'.split('/')).toEqual(['some', 'page'])
	})

	describe('_getItems', function () {
		it('creates a tree of items from configuration', function () {
			// prettier-ignore
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
			var factory = new ItemFactory(configItems)
			var items = factory._getItems()
			expect(items).not.toBe(configItems)
			expect(configItems[0].hasOwnProperty('id')).toBe(false)
			expect(items[0].id).toBe('page-1')
			expect(items[0].idPath).toBe('page-1')
			expect(items[0].items[1].items[1].id).toBe('page-122')
			expect(items[0].items[1].items[1].idPath).toBe('page-1/page-12/page-122')
			expect(items[1].hasOwnProperty('id')).toBe(true)
			expect(items[1].items[0].hasOwnProperty('id')).toBe(true)
			expect(items[1].items[0].hasOwnProperty('idPath')).toBe(true)
			expect(items[2].hasOwnProperty('id')).toBe(true)
		})
	})

	describe('getItem', function () {
		it('gets item by ID path', function () {
			// prettier-ignore
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
			var factory = new ItemFactory(configItems)
			expect(factory.getItem('/')).toBe(undefined)
			expect(factory.getItem('nonexistent-id-path')).toBe(undefined)
			expect(factory.getItem('nonexistent/id/path')).toBe(undefined)
			expect(factory.getItem('').url).toBe('url-11')
			expect(factory.getItem('page-1').url).toBe('url-11')
			expect(factory.getItem('page-1/page-12').url).toBe('url-121')
			var item = factory.getItem('page-1/page-12/page-122')
			expect(item.title).toBe('Page 122 - Page 12 - Page 1')
			expect(item.url).toBe('url-122')
			expect(item.navigation.length).toBe(3)
		})
	})
})
