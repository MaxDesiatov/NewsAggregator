  define(['backbone', 'backbone.marionette', 'news', 'header'],
    function (Backbone, Marionette, newsController, headerLayout) {
      var app = new Marionette.Application();

      app.addRegions({
        content: "#content",
        header: "#header"
      });

      app.on("initialize:after", function () {
        if (!Backbone.history.started)
          Backbone.history.start();
        Backbone.history.navigate('news', { trigger: true });
        app.header.show(headerLayout);
      });

      NewsRouter = Marionette.AppRouter.extend({
        controller: newsController,
        appRoutes: {
          news: 'index',
          bbc: 'bbc',
          sky: 'sky'
        }
      });

      var nr = new NewsRouter();
      return app;
});
