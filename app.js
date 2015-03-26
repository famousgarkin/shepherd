var App = Ember.Application.create({
})

App.Router.map(function() {
    this.resource('item', {path: '/*idPath'})
})

App.TitleHandler = Ember.Mixin.create({
    title: config.title,
    titleChanged: function() {
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
    var items = config.items.copy(true)
    var visitItem = function visitItem(item) {
        if (item.name) {
            item.id = item.name
                .replace(/(\s|[\/])+/g, '-')
                .replace(/[?]+/g, '')
                .toLowerCase()
        }
        if (item.items) {
            item.items.forEach(function(item) {
                visitItem(item)
            })
        }
    }
    visitItem({items: items})

    var itemFactory = function(idPath) {
        // TODO: arbitrary level selection
        if (idPath === '') {
            item = items[0]
        } else {
            item = items.find(function(item) {
                return item.id == idPath.toLowerCase()
            })
        }
        if (item) {
            Ember.set(item, 'navigation', [items])
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
