import 'babel-polyfill';
import ResizeObserver from 'resize-observer-polyfill';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var plugin = {
  install: function install(Vue) {
    Vue.mixin({
      data: function data() {
        return {
          $_elementQueryMixin_resizeObserver: null,
          $_elementQueryMixin_size: {
            width: null,
            height: null
          },
          $_elementQueryMixin_eq: null
        };
      },
      computed: {
        $eq: function $eq() {
          var _this = this;

          if (this.$data.$_elementQueryMixin_eq && this.$data.$_elementQueryMixin_eq.breakpoints && this.$data.$_elementQueryMixin_size && // mark this.$data.$_elementQueryMixin_size.width and this.$data.$_elementQueryMixin_size.height as dependencies
          // for the reactivity of the computed breakpoints-property
          typeof this.$data.$_elementQueryMixin_size.width === "number" && typeof this.$data.$_elementQueryMixin_size.height === "number") {
            // iterate over all queries and set their state
            // base on the query they have as properties
            return Object.keys(this.$data.$_elementQueryMixin_eq.breakpoints).reduce(function (accumulator, currentValue) {
              return _objectSpread2(_objectSpread2({}, accumulator), {}, _defineProperty({}, currentValue, _this.$_elementQueryMixin_checkAllConditions(_this.$data.$_elementQueryMixin_eq.breakpoints[currentValue])));
            }, {
              ready: true
            });
          }

          return {
            ready: false
          };
        }
      },
      watch: {
        // eslint-disable-next-line func-names
        "$data.$_elementQueryMixin_eq": function $data$_elementQueryMixin_eq() {
          var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              breakpoints = _ref.breakpoints;

          if (breakpoints) {
            // $options.eq have been assigned a value
            this.$_elementQueryMixin_init();
          }
        }
      },
      mounted: function mounted() {
        // make $options.eq reactive by
        // assigning it to the component data
        this.$data.$_elementQueryMixin_eq = this.$options.eq;
      },
      beforeDestroy: function beforeDestroy() {
        this.$_elementQueryMixin_destroy();
      },
      methods: {
        /**
         * initialize the ResizeObserver for this component
         */
        $_elementQueryMixin_init: function $_elementQueryMixin_init() {
          var _this2 = this;

          function isElement(element) {
            return element instanceof Element || element instanceof HTMLDocument;
          }

          this.$nextTick(function () {
            if (!_this2.$el) {
              return;
            }

            if (!isElement(_this2.$el)) {
              return;
            }

            _this2.$data.$_elementQueryMixin_resizeObserver = new ResizeObserver(function (_ref2) {
              var _ref3 = _slicedToArray(_ref2, 1),
                  entry = _ref3[0];

              var _entry$contentRect = entry.contentRect,
                  height = _entry$contentRect.height,
                  width = _entry$contentRect.width;

              if (_this2.$data.$_elementQueryMixin_size) {
                _this2.$data.$_elementQueryMixin_size.height = height;
                _this2.$data.$_elementQueryMixin_size.width = width;
              }
            }).observe(_this2.$el);
          });
        },

        /**
         * Stop observing the current element and disconnect the ResizeObserver
         */
        $_elementQueryMixin_destroy: function $_elementQueryMixin_destroy() {
          if (this.$data.$_elementQueryMixin_resizeObserver) {
            this.$data.$_elementQueryMixin_resizeObserver.disconnect();
          }
        },

        /**
         * Checks all the conditions of a breakpoint
         * returns `true` if all conditions match
         * @param {object} bp
         */
        $_elementQueryMixin_checkAllConditions: function $_elementQueryMixin_checkAllConditions(bp) {
          var _this3 = this;

          // .find() result === `undefined` means all condition passed as `true`
          // so we invert the returned result
          return !Object.keys(bp).find( // if any condition returns false:
          // we break out of the iteration early because of `.find()`
          function (key) {
            return !_this3.$_elementQueryMixin_checkCondition(key, bp[key]);
          });
        },

        /**
         * Checks the condition of a specific condition + value
         * @param {string} type
         * @param {number} value
         */
        $_elementQueryMixin_checkCondition: function $_elementQueryMixin_checkCondition(type, value) {
          switch (type) {
            case "minWidth":
              return this.$data.$_elementQueryMixin_size.width >= value;

            case "maxWidth":
              return this.$data.$_elementQueryMixin_size.width <= value;

            case "minHeight":
              return this.$data.$_elementQueryMixin_size.height >= value;

            case "maxHeight":
              return this.$data.$_elementQueryMixin_size.height <= value;
            // no default
          }

          return false;
        }
      }
    });
  }
};

export { plugin as default };
