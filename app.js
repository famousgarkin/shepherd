var App = Ember.Application.create({
})

App.initializer({
    name: 'config',
    initialize: function(container, app) {
        app.config = Ember.copy(config)
    },
})

App.Router.map(function() {
    this.resource('item', {path: '/*idPath'})
})

App.TitleHandler = Ember.Mixin.create({
    _titleFactory: function(subtitle) {
        if (subtitle) {
            return [subtitle, App.config.title].join(' - ')
        }
        return App.config.title
    },
    setTitle: function(subtitle) {
        document.title = this._titleFactory(subtitle)
    },
})

App.IndexRoute = Ember.Route.extend(App.TitleHandler, {
    redirect: function() {
        this.transitionTo('item', '')
    },
})

App.Item = Ember.Object.extend({
    title: null,
    url: null,
    navigation: [],
})

App.ItemFactory = Ember.Mixin.create({
    _getItemId: function(name) {
        return name
        .replace(/([^a-z0-9])+/ig, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()
    },
    _getItemIds: function(idPath) {
        return idPath.split('/')
    },
    _getItemIdPath: function(id, parentIdPath) {
        if (parentIdPath) {
            return [parentIdPath, id].join('/')
        }
        return id
    },
    _ensureItemId: function(item) {
        item.id = this._getItemId(item.name)
    },
    _ensureItemIdPath: function(item, parent) {
        item.idPath = this._getItemIdPath(item.id, parent ? parent.idPath : null)
    },
    getItems: function(configItems) {
        var self = this
        var items = function visit(items, parent) {
            items = items.filter(function(item) {
                if (item) {
                    self._ensureItemId(item)
                    self._ensureItemIdPath(item, parent)
                    if (item.items) {
                        item.items = visit(item.items, item)
                    }
                    return item
                }
            })
            return items
        }(Ember.copy(configItems, true))
        return items
    },
    getItem: function(items, idPath) {
        idPath = idPath.toLowerCase() || items[0].idPath
        ids = this._getItemIds(idPath)
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
                return App.Item.create({
                    title: title.join(' - '),
                    url: item.url,
                    navigation: navigation,
                })
            }
        }(items, ids)
        return item
    },
})

App.ItemRoute = Ember.Route.extend(App.TitleHandler, App.ItemFactory, {
    model: function(params) {
        var items = this.getItems(App.config.items)
        var item = this.getItem(items, params.idPath)
        if (!item) {
            return this.transitionTo('item', '')
        }
        this.setTitle(item.title)
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
        spanner.span(this.$())
    },
})
