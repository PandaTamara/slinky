"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 * Fork Slinky
 * Rather sweetmenus
 * @author Ali Zahid <ali.zahid@live.com>
 * @author fork Panda Tamara <link@mimika-team.ru>
 * @license MIT
 */

/**
 * Static constants
 */
var MAIN_CLASS = 'sm-wrap',
    HEADER_CLASS = 'sm-header',
    TITLE_CLASS = 'sm-title',
    NEXT_CLASS = 'sm-next',
    BACK_CLASS = 'sm-back';

var Slinky =
/*#__PURE__*/
function () {
  _createClass(Slinky, [{
    key: "options",
    // default options
    get: function get() {
      return {
        resize: true,
        speed: 300,
        theme: false,
        title: true,
        backLabelMarkup: '<label><i class="sm-back-icon"></i></label>',
        nextLabelMarkup: '<label>%title%<i class="sm-next-icon"></i></label>',
        mainClass: false,
        headerClass: false,
        backClass: false,
        titleClass: false,
        nextClass: false
      };
    }
  }]);

  function Slinky(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Slinky);

    // save settings
    this.settings = _objectSpread({}, this.options, options); // let's go!

    this._init(element);
  } // setup the DOM just for us


  _createClass(Slinky, [{
    key: "_init",
    value: function _init(element) {
      // the two elements of water and moisture
      this.menu = jQuery(element);
      this.base = this.menu.children().first();
      var base = this.base,
          menu = this.menu,
          settings = this.settings; // set theme

      menu.addClass(MAIN_CLASS).addClass(settings.mainClass).addClass(settings.theme); // set transition speed

      this._transition(settings.speed); // create header item


      var header = jQuery('<li>').addClass(HEADER_CLASS).addClass(settings.headerClass); // prepend it to the list

      jQuery('li > ul', menu).prepend(header); // do we need to add titles?

      if (settings.title) {
        // loop through each child list
        jQuery('li > ul', menu).each(function (index, element) {
          // get the label from the parent link
          var label = jQuery(element).parent().find('a').first(); // if it's not empty, create the title

          if (label) {
            var title = jQuery(label.attr('href') === '#' ? jQuery('<label>') : jQuery('<a>').attr('href', label.attr('href'))).addClass(TITLE_CLASS).addClass(settings.titleClass).text(label.text()); // append it to the immediate header

            jQuery('> .' + HEADER_CLASS, element).append(title);
          }
        });
      } // create back buttons


      var back = jQuery(settings.backLabelMarkup).addClass(BACK_CLASS).addClass(settings.backClass); // prepend them to the headers

      jQuery('.' + HEADER_CLASS, menu).append(back); // add arrows to links with children

      jQuery('a + ul', menu).each(function (i, el) {
        jQuery(el).prev().replaceWith(jQuery(settings.nextLabelMarkup.replace('%title%', jQuery(el).prev().text())).addClass(NEXT_CLASS).addClass(settings.nextClass));
      }); // add click listeners

      this._addListeners(); // jump to initial active


      this._jumpToInitial();
    } // click listeners

  }, {
    key: "_addListeners",
    value: function _addListeners() {
      var _this = this;

      var menu = this.menu,
          settings = this.settings;
      jQuery('label', menu).on('click', function (e) {
        // prevent broken/half transitions
        if (_this._clicked + settings.speed > Date.now()) {
          return false;
        } // cache click time to check on next click


        _this._clicked = Date.now(); // get the link

        var link = jQuery(e.currentTarget); // time to move

        if (link.hasClass(BACK_CLASS)) {
          // and two steps back
          // just one step back, actually
          // make the move
          _this._move(-1, function () {
            // remove the current active
            menu.find('.active').removeClass('active'); // set the new active

            link.parent().parent().hide().parentsUntil(menu, 'ul').first().addClass('active');
          }); // resize the menu if need be


          if (settings.resize) {
            _this._resize(link.parent().parent().parentsUntil(menu, 'ul'));
          }
        } else if (link.hasClass(NEXT_CLASS)) {
          // one step forward
          // remove the current active
          menu.find('.active').removeClass('active'); // set the new active

          link.next().show().addClass('active'); // make the chess move

          _this._move(1); // resize the menu if need be


          if (settings.resize) {
            _this._resize(link.next());
          }
        }
      });
    } // jump to initial active on init

  }, {
    key: "_jumpToInitial",
    value: function _jumpToInitial() {
      var menu = this.menu,
          settings = this.settings; // get initial active

      var active = menu.find('.active');

      if (active.length > 0) {
        // remove initial active
        active.removeClass('active'); // jump without animation

        this.jump(active, false);
      } // set initial height on the menu
      // to fix the first transition resize bug


      setTimeout(function () {
        return menu.height(menu.outerHeight());
      }, settings.speed);
    } // slide the menu

  }, {
    key: "_move",
    value: function _move() {
      var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      // don't bother packing if we're not going anywhere
      if (depth === 0) {
        return;
      }

      var settings = this.settings,
          base = this.base; // get current position from the left

      var left = Math.round(parseInt(base.get(0).style.left)) || 0; // set the new position from the left

      base.css('left', "".concat(left - depth * 100, "%")); // callback after the animation

      if (typeof callback === 'function') {
        setTimeout(callback, settings.speed);
      }
    } // resize the menu
    // to match content height

  }, {
    key: "_resize",
    value: function _resize(content) {
      var menu = this.menu;
      menu.height(content.outerHeight());
    } // set the transition speed

  }, {
    key: "_transition",
    value: function _transition() {
      var speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
      var menu = this.menu,
          base = this.base;
      menu.css('transition-duration', "".concat(speed, "ms"));
      base.css('transition-duration', "".concat(speed, "ms"));
    } // jump to an element

  }, {
    key: "jump",
    value: function jump(target) {
      var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!target) {
        return;
      }

      var menu = this.menu,
          settings = this.settings;
      var to = jQuery(target); // get all current active

      var active = menu.find('.active'); // how many moves must we jump?

      var count = 0; // this many
      // until we reach the parent list

      if (active.length > 0) {
        count = active.parentsUntil(menu, 'ul').length;
      } // remove current active
      // hide all lists


      menu.find('ul').removeClass('active').hide(); // get parent list

      var menus = to.parentsUntil(menu, 'ul'); // show parent list

      menus.show(); //

      to.show().addClass('active'); // set transition speed to 0 if no animation

      if (!animate) {
        this._transition(0);
      } // make the checkers move


      this._move(menus.length - count); // resize menu if need be


      if (settings.resize) {
        this._resize(to);
      } // set transition speed to default after transition


      if (!animate) {
        this._transition(settings.speed);
      }
    } // go big or go home
    // just go home

  }, {
    key: "home",
    value: function home() {
      var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var base = this.base,
          menu = this.menu,
          settings = this.settings; // set transition speed to 0 if no animation

      if (!animate) {
        this._transition(0);
      } // get current active


      var active = menu.find('.active'); // get all parent lists

      var parents = active.parentsUntil(menu, 'ul'); // make the move

      this._move(-parents.length, function () {
        // remove the current active
        active.removeClass('active').hide(); // hide all parents except base

        parents.not(base).hide();
      }); // resize if need be


      if (settings.resize) {
        this._resize(base);
      } // set transition speed back to default


      if (animate === false) {
        this._transition(settings.speed);
      }
    } // crush, kill, destroy

  }, {
    key: "destroy",
    value: function destroy() {
      var _this2 = this;

      var base = this.base,
          menu = this.menu,
          settings = this.settings; // remove all headers

      jQuery('.' + HEADER_CLASS, menu).remove(); // remove Slinky links
      // and click listeners

      jQuery('a', menu).removeClass('next').off('click'); // remove inline styles

      menu.css({
        height: '',
        'transition-duration': ''
      });
      base.css({
        left: '',
        'transition-duration': ''
      }); // remove Slinky HTML

      jQuery('li > a > span', menu).contents().unwrap(); // remove any current active

      menu.find('.active').removeClass('active'); // remove any Slinky style classes

      var styles = menu.attr('class').split(' ');
      styles.forEach(function (style) {
        if (style.indexOf('slinky') === 0) {
          menu.removeClass(style);
        }
      }); // reset fields

      var fields = ['settings', 'menu', 'base'];
      fields.forEach(function (field) {
        return delete _this2[field];
      });
    }
  }]);

  return Slinky;
}(); // jQuery plugin


;

(function ($) {
  $.fn.slinky = function (options) {
    var menu = new Slinky(this, options);
    return menu;
  };
})(jQuery);