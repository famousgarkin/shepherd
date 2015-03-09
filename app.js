App = Ember.Application.create({
    // TODO: scrape for release
    LOG_TRANSITIONS: true
})

App.Router.map(function() {
    this.resource('items', {path: '/'}, function() {
        this.resource('item', {path: '/*path'})
    })
})

App.IndexRoute = Ember.Route.extend({
    beforeModel: function() {
        this.transitionTo('items')
    },
})

App.ItemsIndexRoute = Ember.Route.extend({
    beforeModel: function() {
        this.transitionTo('item', {path: ''})
    }
})

App.ItemsRoute = Ember.Route.extend({
    model: function() {
        // TODO: get navigation from configuration
        return {
            navigation: [
                {name: 'page1/test', url: 'url1'},
                {name: 'page2/test', url: 'url2'},
            ],
        }
    },
})

App.ItemRoute = Ember.Route.extend({
    model: function(params) {
        var model = this.modelFor('items')
        var item = model.navigation.find(function(item) {
            return item.name == params.path
        })
        return item
    },
})
