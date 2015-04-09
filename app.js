var App = Ember.Application.create({
})

App.Router.map(function() {
    this.resource('item', {path: '/*idPath'})
})

App.TitleHandler = Ember.Mixin.create({
    title: config.title,
    onTitleChanged: function() {
        var title = this.get('title')
        if (title) {
            title = title + ' - ' + config.title
        } else {
            title = config.title
        }
        document.title = title
    }.observes('title'),
    beforeModel: function() {
        this.set('title')
    },
})

App.IndexRoute = Ember.Route.extend(App.TitleHandler, {
    redirect: function() {
        this.transitionTo('item', '')
    },
})

;(function() {
    var items = Ember.copy(config.items, true)

    var ensureIds = function ensureIds(item, parent) {
        if (item.name) {
            item.id = item.name
                .replace(/(\s|[\/])+/g, '-')
                .replace(/[?]+/g, '')
                .toLowerCase()
            if (parent && parent.idPath) {
                item.idPath = [parent.idPath, item.id].join('/')
            } else {
                item.idPath = item.id
            }
        }
        if (item.items) {
            item.items.forEach(function(item) {
                ensureIds(item, this)
            }.bind(item))
        }
    }
    ensureIds({items: items})

    var itemFactory = function(idPath) {
        // TODO: arbitrary level ID path selection
        idPath = idPath.toLowerCase()
        var item
        var localItems = Ember.copy(items, true)
        if (idPath === '') {
            var item = localItems[0]
        } else {
            var item = localItems.find(function(item) {
                return item.id == idPath
            })
        }
        if (item) {
            Ember.set(item, 'active', true)
            Ember.set(item, 'navigation', [localItems])
        }
        return item
    }

    App.ItemRoute = Ember.Route.extend(App.TitleHandler, {
        model: function(params) {
            var item = itemFactory(params.idPath)
            if (item) {
                this.set('title', item.name)
            } else {
                this.transitionTo('item', '')
            }
            return item
        },
    })
}())

App.ItemView = Ember.View.extend({
    didInsertElement: function() {
        spanner.span(this.$('.url-content'))
    },
})
