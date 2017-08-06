define('canvas', ['exports', 'grow'], function (exports, _grow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _grow2 = _interopRequireDefault(_grow);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Canvas = function () {
    function Canvas() {
      var _this = this;

      _classCallCheck(this, Canvas);

      this.element = document.createElement('canvas');
      this.context = this.element.getContext('2d');
      this.context.globalCompositionOperation = 'overlay';
      document.body.appendChild(this.element);
      this.ratio = window.devicePixelRatio || 1;
      window.addEventListener('resize', function () {
        return _this.fitElement();
      });
      this.fitElement();
    }

    _createClass(Canvas, [{
      key: 'fitElement',
      value: function fitElement() {
        var _window = window,
            width = _window.innerWidth,
            height = _window.innerHeight;

        this.element.width = width * this.ratio;
        this.element.height = height * this.ratio;
        this.context.scale(this.ratio, this.ratio);
        new _grow2.default(this.context, width, height);
      }
    }]);

    return Canvas;
  }();

  exports.default = Canvas;
});
define('colony', ['exports', 'options', 'utils'], function (exports, _options, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var random = Math.random;

  var Colony = function () {
    function Colony(grow, x, y, color) {
      _classCallCheck(this, Colony);

      this.edges = [];

      this.context = grow.context;
      this.width = grow.width;
      this.height = grow.height;
      this.grid = grow.grid;
      this.plant(x, y, color);
    }

    _createClass(Colony, [{
      key: 'plant',
      value: function plant(x, y, color) {
        if (this.edges.length < _options.growEdgeLimit) {
          this.context.fillStyle = (0, _options.growColor)(color);
          this.context.fillRect(x, y, 1, 1);
          this.grid[x][y] = true;
          this.edges.push([x, y, color]);
        }
      }
    }, {
      key: 'grow',
      value: function grow() {
        var _this = this;

        var currentEdges = (0, _options.growEdgeSlice)(this.edges);
        currentEdges.forEach(function (edge) {
          return _this.spread(edge[0], edge[1], edge[2]);
        });
      }
    }, {
      key: 'neighbors',
      value: function neighbors(x, y) {
        var _this2 = this;

        var top = x > 0,
            bottom = x < this.width - 1;
        var left = y > 0,
            right = y < this.height - 1;

        return [top && [-1, 0], bottom && [+1, 0], top && left && [-1, -1], top && right && [-1, +1], bottom && left && [+1, -1], bottom && right && [+1, +1], left && [0, -1], right && [0, +1]].filter(function (n) {
          return n;
        }).map(function (n) {
          return [x + n[0], y + n[1]];
        }).filter(function (n) {
          return !_this2.grid[n[0]][n[1]] || random() < _options.growBackProbability;
        });
      }
    }, {
      key: 'spread',
      value: function spread(x, y, color) {
        var _context;

        var neighbors = (_context = this.neighbors(x, y), _utils.shuffle).call(_context);
        for (var i = 0; i < neighbors.length; i++) {
          var _neighbors$i = _slicedToArray(neighbors[i], 2),
              nx = _neighbors$i[0],
              ny = _neighbors$i[1];

          color = (color + _options.growColorIncrement) % 1;
          this.plant(nx, ny, color);
          var chance = random();
          if (chance < _options.growSpreadProbability) {
            this.spread(nx, ny, color);
            return;
          } else if (1 - chance < _options.growBranchProbability) {
            return;
          }
        }
      }
    }]);

    return Colony;
  }();

  exports.default = Colony;
});
define('grow', ['exports', 'colony', 'options', 'utils'], function (exports, _colony, _options, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _colony2 = _interopRequireDefault(_colony);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var random = Math.random,
      round = Math.round;

  var Grow = function () {
    function Grow(context, width, height) {
      _classCallCheck(this, Grow);

      this.colonies = [];

      this.context = context;
      this.width = width;
      this.height = height;
      this.grid = (0, _utils.ndArray)(width, height);
      this.seed();
      this.grow();
    }

    _createClass(Grow, [{
      key: 'seed',
      value: function seed() {
        var width = this.width,
            height = this.height;

        var count = _options.growColonyCount;
        while (count--) {
          var x = round(random() * width);
          var y = round(random() * height);
          var color = random();
          var colony = new _colony2.default(this, x, y, color);
          this.colonies.push(colony);
        }
      }
    }, {
      key: 'grow',
      value: function grow() {
        var _this = this;

        this.colonies.forEach(function (colony) {
          return colony.grow();
        });
        requestAnimationFrame(function () {
          return _this.grow();
        });
      }
    }]);

    return Grow;
  }();

  exports.default = Grow;
});
define('main', ['exports', 'canvas'], function (exports, _canvas) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = main;

  var _canvas2 = _interopRequireDefault(_canvas);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function main() {
    var canvas = new _canvas2.default();
  }
});
define("options", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var abs = Math.abs;


  var growEdgeSlices = {
    first: function first(arr) {
      return arr.splice(0, growSpreadLimit);
    },
    last: function last(arr) {
      return arr.splice(arr.length - growSpreadLimit, growSpreadLimit);
    }
  };
  var growColors = {
    rainbow: function rainbow(n) {
      return "hsl(" + n * 360 + ", 65%, 65%";
    },
    clouds: function clouds(n) {
      n = 2 * abs(n - 0.5);
      return "hsl(" + (n * 100 + 150) + ", " + (65 + n * 15) + "%, " + (50 + n * 10) + "%";
    }
  };
  var growEdgeSlice = exports.growEdgeSlice = growEdgeSlices.last;
  var growColor = exports.growColor = growColors.rainbow;
  var growBranchProbability = exports.growBranchProbability = 0.05;
  var growSpreadProbability = exports.growSpreadProbability = 0.5;
  var growBackProbability = exports.growBackProbability = 0.05;
  var growEdgeLimit = exports.growEdgeLimit = 100000;
  var growSpreadLimit = exports.growSpreadLimit = 100;
  var growColorIncrement = exports.growColorIncrement = 0.0001;
  var growColonyCount = exports.growColonyCount = 50;
});
define("utils", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.angle = angle;
  exports.distance = distance;
  exports.add = add;
  exports.subtract = subtract;
  exports.sum = sum;
  exports.average = average;
  exports.dot = dot;
  exports.weightedAverage = weightedAverage;
  exports.pairs = pairs;
  exports.limit = limit;
  exports.sign = sign;
  exports.ndArray = ndArray;
  exports.slicedEach = slicedEach;
  exports.shuffle = shuffle;
  var sin = Math.sin,
      ata2 = Math.ata2,
      min = Math.min,
      max = Math.max,
      sqrt = Math.sqrt,
      floor = Math.floor,
      random = Math.random;
  function angle(a, b) {
    return atan2(a[1] - b[1], a[0] - b[0]);
  }

  function distance(x, y) {
    return sqrt(x * x + y * y);
  }

  function add(a, b) {
    return a + b;
  }

  function subtract(a, b) {
    return a - b;
  }

  function sum(arr) {
    return arr.reduce(add);
  }

  function average(arr) {
    return sum(arr) / arr.length;
  }

  function dot(a, b) {
    return a.reduce(function (sum, item, index) {
      return sum + item * b[index];
    }, 0);
  }

  function weightedAverage(weights) {
    return dot(this, weights) / sum(weights);
  }

  function pairs() {
    var _this = this;

    return Array(this.length - 1).fill(0).map(function (_, i) {
      return [_this[i], _this[i + 1]];
    });
  }

  function limit(n, lower, upper) {
    return max(min(n, upper), lower);
  }

  function sign(n) {
    return n > 0 ? 1 : n < 0 ? -1 : 0;
  }

  function ndArray(dimension) {
    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    if (dimension === undefined) return;
    return Array(dimension).fill(0).map(function () {
      return ndArray.apply(undefined, rest);
    });
  }

  function slicedEach(min, max, fn) {
    for (var i = min; i < max; i++) {
      fn(this[i]);
    }
  }

  function shuffle() {
    for (var i = this.length - 1; i > 0; i--) {
      var index = floor(random() * i);
      var _ref = [this[index], this[i]];
      this[i] = _ref[0];
      this[index] = _ref[1];
    }
    return this;
  }
});//# sourceMappingURL=script.map
