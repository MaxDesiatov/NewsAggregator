var locomotive = require('locomotive'),
    _          = require('underscore'),
    FeedParser = require('feedparser'),
    request    = require('request'),
    moment     = require('moment'),
NewsController = new locomotive.Controller();

_(NewsController).extend({
  index: function () {
    var that = this;
    var items = [];
    request('http://feeds.bbci.co.uk/news/rss.xml').pipe(new FeedParser())
    .on('readable', function () {
      var stream = this, item;
      while (item = stream.read()) {
        items.push(item);
      }
    })
    .on('end', function () {
      var res = _(items).chain()
        .sortBy(function (item) { return -moment(item.date).valueOf() })
        .first(10).value();
      that.res.send(res);
    });
  },

  show: function () {
    this.res.send({item: 'blah'});
  }
});

module.exports = NewsController;
