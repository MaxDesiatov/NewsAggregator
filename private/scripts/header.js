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