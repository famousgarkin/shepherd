var Shepherd = Shepherd || {}

Shepherd.config = Shepherd.config || null

Shepherd.titleFactory = function (subtitle) {
	if (subtitle) {
		return [subtitle, Shepherd.config.title].join(' - ')
	}
	return Shepherd.config.title
}

Shepherd.Item = function (configItem, parent) {
	this.name = configItem.name
	this.url = configItem.url
	this.items = configItem.items

	this.id = Shepherd.Item._getId(this.name)

	this.idPath = Shepherd.Item._getIdPath(this.id, parent ? parent.idPath : null)
}
Shepherd.Item._getId = function (name) {
	return name
	.replace(/([^a-z0-9])+/ig, '-')
	.replace(/^-|-$/g, '')
	.toLowerCase()
}
Shepherd.Item._getIdPath = function (id, parentIdPath) {
	return parentIdPath ? [parentIdPath, id].join('/') : id
}

Shepherd.ItemFactory = function () {
}
Shepherd.ItemFactory.prototype._getItemIds = function(idPath) {
	return idPath.split('/')
}
Shepherd.ItemFactory.prototype.getItems = function(configItems) {
	return (function visit(configItems, parent) {
		return configItems.map(function(configItem) {
			var item = new Shepherd.Item(configItem, parent)
			if (item.items) {
				item.items = visit(item.items, item)
			}
			return item
		})
	// TODO: make Ember independent
	})(Ember.copy(configItems, true))
}
Shepherd.ItemFactory.prototype.getItem = function(items, idPath) {
	idPath = idPath.toLowerCase() || items[0].idPath
	var ids = this._getItemIds(idPath)
	var item = function visit(items, ids, navigation, title) {
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
	}(items, ids)
	return item
}

var App = Ember.Application.create({
})

App.Router.map(function() {
	this.resource('item', {path: '/*idPath'})
})

App.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('item', '')
	},
})

App.Item = Ember.Object.extend({
	title: null,
	url: null,
	navigation: [],
})

App.ItemRoute = Ember.Route.extend({
	itemFactory: new Shepherd.ItemFactory(),
	model: function(params) {
		var items = this.itemFactory.getItems(Shepherd.config.items)
		var item = this.itemFactory.getItem(items, params.idPath)
		if (!item) {
			return this.transitionTo('item', '')
		}
		document.title = Shepherd.titleFactory(item.title)
		return item
	},
})

App.RemoteContentComponent = Ember.Component.extend({
	tagName: 'iframe',
	// NOTE: fixes dying on IE8 when appending text node with default layout
	defaultLayout: null,
	classNames: ['url-content'],
	attributeBindings: ['frameborder', 'url:src'],
	frameborder: 0,
	url: null,
	didInsertElement: function() {
		var element = this.$()
		var span = function() {
			var width = $(window).width() - element.offset().left
			element.width(width)
			var height = $(window).height() - element.offset().top
			element.height(height)
		}
		span()
		Ember.$(window).resize(span)
	},
})
