(function ($) {
    $.fn.cloudTag = function (options) {
        var defaults = {
            ballSize: 200,
            max: 3,
            interval: 50, // ms
            duration: 3 * 1000, // 3s
            tags: ['a', 'b', 'c']
        };

        // fetch options

        var opts = $.extend({}, defaults, options);

        var duration = opts.duration;
        var interval = opts.interval; // ms
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
            console.log("setup");
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

                var anchor = document.createElement('a');
                $(anchor).addClass('tag').html(label).appendTo(paper);

                if (!anchor.style )
                    anchor.style = {};

                anchor.style.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")"; // set random color

                // create wrapper class

                var t = new tag(anchor, x, y, z);

                // remember

                tags.push(t);

                // and position

                t.move();
            } // for
        }

        // timer stuff

        function now() {
            return new Date().getTime();
        }

        var timer = undefined;
        var startTime;

        function animate() {
            if (timer === undefined) {
                startTime = now();
                timer = setInterval(function () {
                    // check duration

                    if (now() - startTime >= duration) {
                        clearInterval(timer);
                        timer = undefined;
                    } // if

                    // rotate

                    rotateX();
                    rotateY();

                    // move tags

                    tags.forEach(function (tag) {
                        tag.move();
                    });
                }, interval);
            } // if
        }

        function rotateX() {
            var cos = Math.cos(angleX);
            var sin = Math.sin(angleX);

            tags.forEach(function (tag) {
                var y1 = tag.y * cos - tag.z * sin;
                var z1 = tag.z * cos + tag.y * sin;

                tag.y = y1;
                tag.z = z1;
            });
        }

        function rotateY() {
            var cos = Math.cos(angleY);
            var sin = Math.sin(angleY);

            tags.forEach(function (tag) {
                var x1 = tag.x * cos - tag.z * sin;
                var z1 = tag.z * cos + tag.x * sin;

                tag.x = x1;
                tag.z = z1;
            });
        }

        // the tag class

        var tag = function (ele, x, y, z) {
            this.ele = ele; // the anchor

            this.x = x;
            this.y = y;
            this.z = z;

            return this;
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

        // callback

        function onMouseMove(event) {
            var x = event.clientX - EX - CX;
            var y = event.clientY - EY - CY;

            angleY = x * 0.0001;
            angleX = y * 0.0001;

            animate(); // restart timer if required
        }

        // add event listener

        if ("addEventListener" in window)
            paper.addEventListener("mousemove", onMouseMove);
        else
            paper.attachEvent("onmousemove", onMouseMove);

        // get goin'

        setup();
        animate();
    }
})(jQuery);