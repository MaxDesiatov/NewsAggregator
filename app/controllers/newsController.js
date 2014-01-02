var locomotive = require('locomotive'),
    _          = require('underscore'),
    FeedParser = require('feedparser'),
    request    = require('request'),
    moment     = require('moment'),
NewsController = new locomotive.Controller(),
    bbcUrl     = 'http://feeds.bbci.co.uk/news/rss.xml',
    skyUrl     = 'http://news.sky.com/feeds/rss/home.xml';

_(NewsController).extend({
  index: function () {
    var that = this;
    var items = [];
    var rssUrl = bbcUrl;
    var firstFetchFinished = this.req.query.source;

    if (this.req.query.source === 'sky') {
      console.log('sky requested');
      rssUrl = skyUrl;
    }

    var query = function () {
      request(rssUrl).pipe(new FeedParser())
      .on('readable', function () {
        var stream = this, item;
        while (item = stream.read()) {
          item.sourceRSS = rssUrl === bbcUrl ? 'BBC News' : 'SKY News';
          items.push(item);
        }
      })
      .on('end', function () {
        send();
      });
    }

    var send = function () {
      if (firstFetchFinished) {
        var res = _(items).chain()
          .sortBy(function (item) { return -moment(item.date).valueOf() })
          .first(10).value();
        that.res.send(res);
      } else {
        firstFetchFinished = true;
        rssUrl = skyUrl;
        query();
      }
    }

    query();

  },

  show: function () {
    this.res.send({item: 'blah'});
  }
});

module.exports = NewsController;
