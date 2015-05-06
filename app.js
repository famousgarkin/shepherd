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

App.ItemFactory = Ember.Mixin.create({
    _getItemId: function(name) {
        return name
        .replace(/([^a-z0-9])+/ig, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()
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
    _getItems: function(configItems) {
        var self = this
        var items = Ember.copy(configItems, true)
        var visit = function visit(item, parent){
            self._ensureItemId(item)
            self._ensureItemIdPath(item, parent)
            if (item.items) {
                item.items.forEach(function(child) {
                    visit(child, item)
                })
            }
        }
        items.forEach(function(item) {
            visit(item)
        })
        return items
    },
    createItem: function(idPath) {
        var self = this
        var items = this._getItems(App.config.items)
        // TODO: arbitrary level ID path selection
        idPath = idPath.toLowerCase()
        var item
        if (idPath === '') {
            item = items[0]
        } else {
            item = items.find(function(item) {
                return item.id == idPath
            })
        }
        if (item) {
            Ember.set(item, 'active', true)
            Ember.set(item, 'navigation', [items])
        }
        return item
    },
})

App.ItemRoute = Ember.Route.extend(App.TitleHandler, App.ItemFactory, {
    model: function(params) {
        var item = this.createItem(params.idPath)
        if (item) {
            this.setTitle(item.name)
        } else {
            this.transitionTo('item', '')
        }
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
