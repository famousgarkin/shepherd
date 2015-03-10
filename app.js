document.title = config.title

;(function() {
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
    visitIds(config)
}(config))

var App = Ember.Application.create({
    // TODO: scrape for release
    LOG_TRANSITIONS: true,
})

App.Router.map(function() {
    this.resource('items', {path: '/'}, function() {
        this.resource('item', {path: '/*path'})
    })
})

App.IndexRoute = Ember.Route.extend({
    redirect: function() {
        this.transitionTo('items')
    },
})

App.ItemsRoute = Ember.Route.extend({
    model: function() {
        return config.items
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
