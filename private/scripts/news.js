define(['backbone', 'backbone.marionette', 'jquery', 'underscore', 
  '../views/news', 'moment'], 
  function (Backbone, Marionette, $, _, templates, moment) {

  var NewsModel = Backbone.Model.extend({});

  var NewsCollection =  Backbone.Collection.extend({
    model: NewsModel,
    url: '/news'
  });

  var NewsItemView = Marionette.ItemView.extend({
    tagName: 'div',
    className: 'cold-md-12',
    modelEvents: {
      'change': 'render'
    },

    template: function (data) {
      return templates.item(data);
    }
  });

  var news = new NewsCollection();

  var Empty = Marionette.ItemView.extend({
    tagName: 'div',
    className: 'cold-md-12',
    template: function () { return 'No news have been loaded.'; }
  });

  var NewsTable = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'jobs',
    itemView: NewsItemView,
    emptyView: Empty,
    collection: news,
    collectionEvents: {
      change: 'render'
    },

    appendHtml: function (collectionView, itemView, index) {
      childrenContainer = $(collectionView.childrenContainer || collectionView.el);
      children = childrenContainer.children();
      if (children.size() === index)
        childrenContainer.append(itemView.el);
      else
        childrenContainer.children().eq(index).before(itemView.el);
    },

    onRender: function () { this.delegateEvents(); }
  });

  var newsTable = new NewsTable();

  var IndexLayout = Marionette.Layout.extend({
    regions: {
      table: '#news-table'
    },

    template: function () { return templates.index(); },

    onRender: function () { this.delegateEvents(); }
  });

  indexLayout = new IndexLayout

  return {
    index: function () {
      news.fetch({ 
        success: function () {
          require('app').content.show(indexLayout);
          indexLayout.table.show(newsTable);
        }
      })
    }
  };
});
