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
    name: null,
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
        var items = Ember.copy(configItems, true)
        items.forEach(function(item) {
            ;(function visit(item, parent){
                self._ensureItemId(item)
                self._ensureItemIdPath(item, parent)
                if (item.items) {
                    item.items.forEach(function(child) {
                        visit(child, item)
                    })
                }
            }(item))
        })
        return items
    },
    getItem: function(items, idPath) {
        // TODO: arbitrary level ID path selection
        idPath = idPath.toLowerCase()
        if (idPath === '') {
            idPath = items[0].idPath
        }
        var item
        ids = this._getItemIds(idPath)
        item = items.find(function(item) {
            return item.id == ids[0]
        })
        if (item) {
            item.active = true
            return App.Item.create({
                name: item.name,
                url: item.url,
                navigation: [items],
            })
        }
    },
})

App.ItemRoute = Ember.Route.extend(App.TitleHandler, App.ItemFactory, {
    model: function(params) {
        var items = this.getItems(App.config.items)
        var item = this.getItem(items, params.idPath)
        if (!item) {
            return this.transitionTo('item', '')
        }
        this.setTitle(item.name)
        return item
    },
})

App.ItemView = Ember.View.extend({
    didInsertElement: function() {
        var $urlContent = this.$('.url-content')
        if ($urlContent.length > 0) {
            spanner.span($urlContent)
        }
    },
})
