App = Ember.Application.create({
    // TODO: scrape for release
    LOG_TRANSITIONS: true
})

App.Router.map(function() {
    this.resource('item', {path: '/:path'})
})
