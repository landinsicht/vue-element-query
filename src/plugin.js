import ResizeObserver from "resize-observer-polyfill";

export default {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          $_elementQueryMixin_resizeObserver: null,
          $_elementQueryMixin_size: {
            width: 0,
            height: 0
          },
          eq: null
        };
      },
      computed: {
        $eq() {
          if (
            this.eq &&
            this.eq.breakpoints &&
            this.$data.$_elementQueryMixin_size &&
            // mark this.$data.$_elementQueryMixin_size.width and this.$data.$_elementQueryMixin_size.height as dependencies
            // for the reactivity of the computed breakpoints-property
            typeof this.$data.$_elementQueryMixin_size.width === "number" &&
            typeof this.$data.$_elementQueryMixin_size.height === "number"
          ) {
            // iterate over all queries and set their state
            // base on the query they have as properties
            return Object.keys(this.eq.breakpoints).reduce(
              (accumulator, currentValue) => ({
                ...accumulator,
                [currentValue]: this.$_elementQueryMixin_checkAllConditions(
                  this.eq.breakpoints[currentValue]
                )
              }),
              {}
            );
          }
          return {};
        }
      },
      watch: {
        eq({ breakpoints } = {}) {
          if (breakpoints) {
            // $options.eq have been assigned a value
            this.$_elementQueryMixin_init();
          }
        }
      },
      mounted() {
        // make $options.eq reactive by
        // assigning it to the component data
        this.eq = this.$options.eq;
      },
      beforeDestroy() {
        this.$_elementQueryMixin_destroy();
      },
      methods: {
        /**
         * initialize the ResizeObserver for this component
         */
        $_elementQueryMixin_init() {
          this.$data.$_elementQueryMixin_resizeObserver = new ResizeObserver(
            ([entry]) => {
              const { height, width } = entry.contentRect;

              if (this.$data.$_elementQueryMixin_size) {
                this.$data.$_elementQueryMixin_size.height = height;
                this.$data.$_elementQueryMixin_size.width = width;
              }
            }
          ).observe(this.$el);
        },

        /**
         * Stop observing the current element and disconnect the ResizeObserver
         */
        $_elementQueryMixin_destroy() {
          if (this.$data.$_elementQueryMixin_resizeObserver) {
            this.$data.$_elementQueryMixin_resizeObserver.disconnect();
          }
        },

        /**
         * Checks all the conditions of a breakpoint
         * returns `true` if all conditions match
         * @param {object} bp
         */
        $_elementQueryMixin_checkAllConditions(bp) {
          // .find() result === `undefined` means all condition passed as `true`
          // so we invert the returned result
          return !Object.keys(bp).find(
            // if any condition returns false:
            // we break out of the iteration early because of `.find()`
            key => !this.$_elementQueryMixin_checkCondition(key, bp[key])
          );
        },

        /**
         * Checks the condition of a specific condition + value
         * @param {string} type
         * @param {number} value
         */
        $_elementQueryMixin_checkCondition(type, value) {
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
