var App = Ember.Application.create({
    // TODO: scrape for release
    LOG_TRANSITIONS: true
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
        // TODO: get items from configuration
        return [
            {name: 'page1/test', url: 'url1'},
            {name: 'page2/test', url: 'url2'},
        ]
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
            return item.name == params.path
        })
    },
})
