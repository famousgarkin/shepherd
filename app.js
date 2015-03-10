var App = Ember.Application.create({
    // TODO: scrape for release
    LOG_TRANSITIONS: true,
})

App.Router.map(function() {
    this.resource('items', {path: '/'}, function() {
        this.resource('item', {path: '/*path'})
    })
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

App.ApplicationRoute = Ember.Route.extend(App.TitleHandler, {
    redirect: function() {
        this.transitionTo('items')
    },
})

App.ItemsRoute = Ember.Route.extend({
    model: function() {
        var items = config.items.copy(true)
        var visitIds = function visitIds(item) {
            if (item.name) {
                item.id = item.name
                    .replace(/(\s|[\/])+/g, '-')
                    .replace(/[?]+/g, '')
            }
            if (item.items) {
                for (var i = 0; i < config.items.length; i++) {
                    visitIds(item.items[i])
                }
            }
        }
        visitIds({items: items})
        return items
    },
})

App.ItemsIndexRoute = Ember.Route.extend({
    redirect: function() {
        this.transitionTo('item', '')
    },
})

App.ItemRoute = Ember.Route.extend({
    model: function(params) {
        var model = this.modelFor('items')
        if (params.path === '') {
            return model[0]
        }
        return model.find(function(item) {
            return item.id == params.path
        })
    },
})
