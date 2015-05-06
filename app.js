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
    itemFactory: function() {
        var items = Ember.copy(App.config.items, true)

        var ensureIds = function ensureIds(item, parent) {
            if (item.name) {
                item.id = item.name
                    .replace(/([^a-z0-9])+/ig, '-')
                    .replace(/^-|-$/g, '')
                    .toLowerCase()
                if (parent && parent.idPath) {
                    item.idPath = [parent.idPath, item.id].join('/')
                } else {
                    item.idPath = item.id
                }
            }
            if (item.items) {
                item.items.forEach(function(child) {
                    ensureIds(child, item)
                })
            }
        }
        ensureIds({items: items})

        return function(idPath) {
            // TODO: arbitrary level ID path selection
            idPath = idPath.toLowerCase()
            var item
            var localItems = Ember.copy(items, true)
            if (idPath === '') {
                item = localItems[0]
            } else {
                item = localItems.find(function(item) {
                    return item.id == idPath
                })
            }
            if (item) {
                Ember.set(item, 'active', true)
                Ember.set(item, 'navigation', [localItems])
            }
            return item
        }
    }(),
})

App.ItemRoute = Ember.Route.extend(App.TitleHandler, App.ItemFactory, {
    model: function(params) {
        var item = this.itemFactory(params.idPath)
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
