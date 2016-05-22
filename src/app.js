var ItemFactory = require('./ItemFactory');

var App = Ember.Application.create({
})
global.App = App

App.Router.map(function() {
	this.resource('item', {path: '/*idPath'})
})

App.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('item', '')
	},
})

App.Item = Ember.Object.extend({
	navigation: [],
	url: null,
})

App.ItemRoute = Ember.Route.extend({
	itemFactory: new ItemFactory(Shepherd.config.items),
	model: function(params) {
		var item = this.itemFactory.getItem(params.idPath)
		if (!item) {
			return this.transitionTo('item', '')
		}
		document.title = [item.title, Shepherd.config.title].join(' - ')
		return App.Item.create({
			navigation: item.navigation,
			url: item.url,
		})
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
