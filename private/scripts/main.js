requirejs.config({
  shim: {
    bootstrap: ['jquery']
  }
});

define(['app'], function (app) {
    app.start();
});