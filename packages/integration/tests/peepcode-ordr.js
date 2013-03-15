var application;

function createApp() {
  var App;

  // Templates
  Ember.TEMPLATES['_tableMenu'] = Ember.Handlebars.compile('<h2>Tables</h2>{{#each table in controller}}{{#linkTo "table" table class="panel six columns"}}{{ table.number }}{{/linkTo}}{{/each}}');
  Ember.TEMPLATES['application'] = Ember.Handlebars.compile('<div class="row"><div class="twelve columns"><h1>Ordr</h1><hr>{{ outlet }}</div></div>');
  Ember.TEMPLATES['food'] = Ember.Handlebars.compile('<ul id="menu">{{#each controller}}<li><a href="#" {{ action "addFood" this }}><img {{ bindAttr src="imageUrl" }} ><p>{{ name }}</p></a></li>{{/each}}</ul>');
  Ember.TEMPLATES['tab'] = Ember.Handlebars.compile('<ul id="customer-tab">{{#each tabItem in tabItems}}<li><h3>{{ tabItem.food.name }}<span>${{ money tabItem.cents }}</span></h3></li>{{else}}<li><h3>Click a food to add it</h3></li>{{/each}}<li id="total"><h3>Total<span>${{ money cents }}</span></h3></li></ul>');
  Ember.TEMPLATES['table'] = Ember.Handlebars.compile('<div class="row"><div class="three columns">{{ render "food" }}</div><div class="nine columns"><h2>Table <span>{{number}}</span></h2>{{ render "tab" tab }}</div></div>');
  Ember.TEMPLATES['tables'] = Ember.Handlebars.compile('<div class="row"><div class="four columns" id="tables">{{ partial "tableMenu" }}</div><div id="order" class="eight columns">{{ outlet }}</div></div>');
  Ember.TEMPLATES['tables/index'] = Ember.Handlebars.compile('<h2>Please select a table</h2>');

  // Application
  App = Ember.Application.create({rootElement: "#qunit-fixture"});
  //App = Ember.Application.extend({name: "App", rootElement: "#qunit-fixture"});

  // Routes

  // Router
  App.Router.map(function () {
    this.resource('tables', function () {
      this.resource('table', {path:':table_id'});
    });
  });

  App.ApplicationRoute = Ember.Route.extend({
    setupController: function () {
      this.controllerFor('food').set('model', App.Food.find());
    }
  });

  App.IndexRoute = Ember.Route.extend({
    redirect: function () {
      this.transitionTo('tables');
    }
  });

  App.TablesRoute = Ember.Route.extend({
    model: function () {
      return App.Table.find();
    }
  });

  // Controllers

  // Implement explicitly to use the object proxy.
  App.TablesController = Ember.ArrayController.extend({
    sortProperties: ['number']
  });

  App.FoodController = Ember.ArrayController.extend({
    addFood: function (food) {
      var table = this.controllerFor('table').get('model'),
          tabItems = table.get('tab.tabItems');

      tabItems.createRecord({
        food: food,
        cents: food.get('cents')
      });
    }
  });

  // Helpers

  // Handlebars Helpers
  Ember.Handlebars.registerBoundHelper('money', function (value) {
    return (value % 100 === 0) ? value / 100 + '.00' : parseInt(value / 100, 10) + '.' + value % 100;
  });

  // Models

  App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.FixtureAdapter'
  });

  App.Table = DS.Model.extend({
    number: DS.attr('number'),
    tab: DS.belongsTo('App.Tab')
  });

  App.Tab = DS.Model.extend({
    tabItems: DS.hasMany('App.TabItem'),
    cents: function () {
      return this.get('tabItems').getEach('cents').reduce(function (accum, item) {
        return accum + item;
      }, 0);
    }.property('tabItems.@each.cents')
  });

  App.TabItem = DS.Model.extend({
    cents: DS.attr('number'),
    food: DS.belongsTo('App.Food')
  });

  App.Food = DS.Model.extend({
    name: DS.attr('string'),
    imageUrl: DS.attr('string'),
    cents: DS.attr('number')
  });

  // Views (none)

  // Fixtures
  // IDs are strings as db may not use numbers to identify resources

  App.Table.FIXTURES = [{
    "number": 1,
    "tab": "1",
    "id": "1"
  }, {
    "number": 2,
    "tab": "2",
    "id": "2"
  }, {
    "number": 3,
    "tab": "3",
    "id": "3"
  }, {
    "number": 4,
    "tab": "4",
    "id": "4"
  }, {
    "number": 5,
    "tab": "5",
    "id": "5"
  }, {
    "number": 6,
    "tab": "6",
    "id": "6"
  }];


  App.Tab.FIXTURES = [{
    "tabItems": [],
    "id": "1"
  }, {
    "tabItems": [],
    "id": "2"
  }, {
    "tabItems": [],
    "id": "3"
  }, {
    "tabItems": [
      "400",
      "401",
      "402",
      "403",
      "404"
    ],
    "id": "4"
  }, {
    "tabItems": [],
    "id": "5"
  }, {
    "tabItems": [],
    "id": "6"
  }];

  App.TabItem.FIXTURES = [{
    "cents": 1500,
    "food": "1",
    "id": "400"
  }, {
    "cents": 300,
    "food": "2",
    "id": "401"
  }, {
    "cents": 700,
    "food": "3",
    "id": "402"
  }, {
    "cents": 950,
    "food": "4",
    "id": "403"
  }, {
    "cents": 2000,
    "food": "5",
    "id": "404"
  }];

  App.Food.FIXTURES = [{
    "name": "Pizza",
    "imageUrl": "img/pizza.png",
    "cents": 1500,
    "id": "1"
  }, {
    "name": "Pancakes",
    "imageUrl": "img/pancakes.png",
    "cents": 300,
    "id": "2"
  }, {
    "name": "Fries",
    "imageUrl": "img/fries.png",
    "cents": 700,
    "id": "3"
  }, {
    "name": "Hot Dog",
    "imageUrl": "img/hotdog.png",
    "cents": 950,
    "id": "4"
  }, {
    "name": "Birthday Cake",
    "imageUrl": "img/birthdaycake.png",
    "cents": 2000,
    "id": "5"
  }];

  return App;
}


module('Peepcode Ordr Application Integration Tests', {
  setup: function() {
    Ember.$('#qunit-fixture').empty();
    Ember.run(function() {
      application = createApp();
    });
  },

  teardown: function() {
    if (application) {
      Ember.run(function(){ application.destroy(); });
    }
    Ember.TEMPLATES = {};
  }
});

test('Given (6) six tables: add food items to the tab on table 1, verify the items/prices on tabs for table 1 and 4', function () {
  expect(17);

  application.ready = function() {
    var q;
    // Test helpers
    q = function (query) {
      // Select within qunit fixture element
      return Ember.$(query, '#app-root');
    };
    q.trimText = function (query) {
      return Ember.$.trim( q(query).text() );
    };

    // Headings on tables index route
    setTimeout(function() {
      start();
      document.location.hash = "/tables";
      equal(q.trimText('h1'), 'Ordr', 'Heading is "Ordr".');
      equal(q.trimText('#order h2'), 'Please select a table', 'Tables index heading correct.');
      stop();
    }, 500);

    // Common table menu
    setTimeout(function() {
      var menuItems;
      start();

      menuItems = q('#tables a');
      equal(menuItems.length, 6, '6 tables in menu.');
      for (var i = 0; i < 6; i++) {
        equal(q.trimText(menuItems[i]), i + 1, 'Passed table menu #' + i + ' is numbered as expected.');
      }

      // Select table 1
      document.location.hash = "/tables/1";
      stop();
    }, 1000);

    // Foods menu
    setTimeout(function() {
      start();
      equal(q('#menu li > a').length, 5, 'Food menu has (5) items.');
      equal(q.trimText('#order h2'), 'Table 1', 'Table 1 Heading correct.');

      // Add pizza to tap on table 1
      q('#menu li:eq(0) > a').trigger('click');
      stop();
    }, 1500);

    // Confirm pizza added to tab on table 1
    setTimeout(function() {
      start();
      equal(q.trimText('#customer-tab li:eq(0) > h3'), 'Pizza$15.00', 'Pizza added to customer tab.');

      // Add fries to tab on table 1
      q('#menu li:eq(2) > a').trigger('click');
      stop();
    }, 2000);

    // Confirm fries added to tab on table 1
    setTimeout(function() {
      start();
      equal(q.trimText('#customer-tab li:eq(1) > h3'), 'Fries$7.00', 'Fries added to customer tab.');
      equal(q.trimText('#total span'), '$22.00', '$22.00 is the total for fries and pizza.');

      // Select table 4
      document.location.hash = "/tables/4";
      stop();
    }, 2500);

    // Confirm foods already in tab on table 4
    setTimeout(function() {
      var actual = [], expected = 'Pizza$15.00Pancakes$3.00Fries$7.00HotDog$9.50BirthdayCake$20.00Total$54.50';

      start();
      q('#customer-tab > li').each(function () {
        actual.push(q.trimText(this));
      });
      equal(actual.join('').replace(/\s/g, ''), expected, 'table 4 has expected foods in tab.');
      equal(q.trimText('#total span'), '$54.50', '$54.50 is the total tab for table 4.');

      // Select table 1
      document.location.hash = "/tables/1";
      stop();
    }, 3000);

    // Table 1 still has a total after viewing table 4
    setTimeout(function() {
      start();
      equal(q.trimText('#total span'), '$22.00', '$22.00 is still the total for table 1.');
      document.location.hash = "/tables";
    }, 3500);

    stop();
  }
});

