(function ($) {
    $.fn.cloudTag = function (options) {
        var defaults = {
            tag: "tag",
            ballSize: 200,
            max: 3,
            tags: ['a', 'b', 'c']
        };

        if (! Array.prototype.forEach)
            Array.prototype.forEach = function (callback) {
                for (var i = 0; i < this.length; i++)
                    callback.call(this[i]);
            };

        //<a class="tag">PHP</a>

        var opts = $.extend({}, defaults, options);

        var interval = 50; // ms
        var paper = $(this)[0];

        var RADIUS = opts.ballSize;
        var fallLength = 300;
        var angleX = Math.PI / fallLength;
        var angleY = Math.PI / fallLength;

        var CX = paper.offsetWidth / 2;
        var CY = paper.offsetHeight / 2;
        var EX = paper.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft;
        var EY = paper.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;

        // create tags

        var tags = [];

        function setup() {
            var len = opts.tags.length;

            for (var i = 0; i < len; i++) {
                var label = opts.tags[i];

                var k = (2 * (i + 1) - 1) / len - 1;
                var a = Math.acos(k);
                var b = a * Math.sqrt(len * Math.PI);

                var x = RADIUS * Math.sin(a) * Math.cos(b);
                var y = RADIUS * Math.sin(a) * Math.sin(b);
                var z = RADIUS * Math.cos(a);

                // create anchor

                var anchor = $('<a>' + label + '</a>');
                anchor.style.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")"; // set random color

                paper.append(anchor);

                // create wapper class

                var t = new tag(anchor, x, y, z);

                // remember

                tags.push(t);

                // and position

                t.move();
            } // for
        }

        function animate() {
            setInterval(function () {
                rotateX();
                rotateY();

                tags.forEach(function () {
                    this.move();
                });
            }, interval);
        }

        function rotateX() {
            var cos = Math.cos(angleX);
            var sin = Math.sin(angleX);

            tags.forEach(function () {
                var y1 = this.y * cos - this.z * sin;
                var z1 = this.z * cos + this.y * sin;

                this.y = y1;
                this.z = z1;
            });
        }

        function rotateY() {
            var cos = Math.cos(angleY);
            var sin = Math.sin(angleY);

            tags.forEach(function () {
                var x1 = this.x * cos - this.z * sin;
                var z1 = this.z * cos + this.x * sin;

                this.x = x1;
                this.z = z1;
            });
        }

        // the tag class

        var tag = function (ele, x, y, z) {
            this.ele = ele; // the anchor

            this.x = x;
            this.y = y;
            this.z = z;
        };

        tag.prototype = {
            move: function () {
                var scale = fallLength / (fallLength - this.z);
                var alpha = ((this.z + RADIUS) / (2 * RADIUS)) + 0.5;

                var style = this.ele.style;

                style.fontSize = 15 * scale + "px";
                style.opacity = alpha;
                style.filter = "alpha(opacity = " + alpha * 100 + ")";
                style.zIndex = parseInt(scale * 100);
                style.left = this.x + CX - this.ele.offsetWidth / 2 + "px";
                style.top = this.y + CY - this.ele.offsetHeight / 2 + "px";
            }
        };

        // add event listener

        if ("addEventListener" in window) {
            paper.addEventListener("mousemove", function (event) {
                var x = event.clientX - EX - CX;
                var y = event.clientY - EY - CY;

                angleY = x * 0.0001;
                angleX = y * 0.0001;
            });
        }
        else {
            paper.attachEvent("onmousemove", function (event) {
                var x = event.clientX - EX - CX;
                var y = event.clientY - EY - CY;

                angleY = x * 0.0001;
                angleX = y * 0.0001;
            });
        }

        // get goin'

        setup();
        animate();
    }
})(jQuery);