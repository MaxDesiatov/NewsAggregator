define(['backbone', 'backbone.marionette', '../views/header'], 
  function (Backbone, Marionette, templates) {

  var HeaderView = Marionette.ItemView.extend({
    ui: {
      bbc: '.bbc',
      sky: '.sky',
      news: '.all'
    },
    className: 'container',
    currentlyActive: null,

    // workaround for template not bind before invocation by marionette.js
    constructor: function () {
      _.bindAll(this, 'template');
      args = Array.prototype.slice.apply(arguments);
      Marionette.ItemView.prototype.constructor.apply(this, args);
    },

    template: function (data) {
      return templates.header({active: this.currentlyActive});
    },

    onRoute: function (route) {
      if (route !== this.currentlyActive && this.ui[this.currentlyActive]) {
        if (this.currentlyActive)
          this.ui[this.currentlyActive].removeClass('active');
        this.ui[route].addClass('active')
      }
      this.currentlyActive = route;
    }
  });

  var headerView = null;
  Backbone.history.on('route', function () {
    headerView.onRoute(Backbone.history.fragment);
  });

  var headerView = new HeaderView();
  return headerView;
});