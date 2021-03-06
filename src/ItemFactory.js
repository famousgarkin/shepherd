import Item from './Item'

export default class ItemFactory {
	constructor(configItems) {
		this._configItems = configItems
	}

	_getItems() {
		return (function visit(configItems, parent) {
			return configItems.map(function (configItem) {
				var item = new Item(configItem, parent)
				if (item.items) {
					item.items = visit(item.items, item)
				}
				return item
			})
		})(this._configItems)
	}

	getItem(idPath) {
		var items = this._getItems()
		idPath = idPath.toLowerCase() || items[0].idPath
		var ids = idPath.split('/')

		return (function visit(items, ids, navigation, title) {
			navigation = navigation || []
			title = title || []
			var item
			var id = ids.shift()
			if (id === undefined) {
				item = items[0]
			} else {
				for (var i = 0; i < items.length; i++) {
					if (items[i].id === id) {
						item = items[i]
						break
					}
				}
			}

			if (item) {
				item.active = true
				navigation.push(items)
				title.unshift(item.name)
				if (item.items) {
					return visit(item.items, ids, navigation, title)
				}
				return {
					title: title.join(' - '),
					url: item.url,
					navigation: navigation,
				}
			}
		})(items, ids)
	}
}
