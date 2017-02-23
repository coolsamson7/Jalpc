(function ($) {
    $.fn.cloudTag = function (options) {
        // helper functions

        function now() {
            return new Date().getTime();
        }

        // defaults

        var defaults = {
            ballSize: 200,
            max: 3,
            interval: 50, // ms
            duration: 3 * 1000, // 3s
            tags: []
        };

        // compute options

        var opts = $.extend({}, defaults, options);

        // set variables

        var labels = opts.tags;
        var ntags = opts.tags.length;

        var max      = opts.max;
        var duration = opts.duration;
        var ttl      = duration;
        var interval = opts.interval; // ms
        var paper    = $(this)[0];

        var RADIUS   = opts.ballSize;
        var fallLength = 300;
        var angleX   = Math.PI / fallLength;
        var angleY   = Math.PI / fallLength;

        var CX       = paper.offsetWidth / 2;
        var CY       = paper.offsetHeight / 2;
        var EX       = paper.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft;
        var EY       = paper.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;

        function nextTTL(time) {
            var ttl2 = ttl / 2;

            return time + ttl2 + Math.random() * ttl2;
        }

        // create tags

        var nextIndex = 0;
        var tags = [];

        function setup() {
            var len = opts.tags.length;
            if (len > max) {
                ttl = duration * max / len;
                len = max;
                nextIndex = max;
            } // if

            var time = now();
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

                anchor.style.color = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")"; // set random color

                // create wrapper class

                var t = new tag(anchor, x, y, z, nextTTL(time));

                // remember

                tags.push(t);

                // and set initial position

                t.move();
            } // for
        }

        // timer stuff


        var animating = false;
        var start = null;

        function animate(timestamp) {
            if (!start)
                start = timestamp;

            var progress = timestamp - start;

            // check duration

            if (progress < duration) {
                // move tags

                var cosX = Math.cos(angleX);
                var sinX = Math.sin(angleX);
                var cosY = Math.cos(angleY);
                var sinY = Math.sin(angleY);

                var t = now(); // hmmm

                tags.forEach(function (tag) {
                    tag
                        .rotateX(cosX, sinX)
                        .rotateY(cosY, sinY)
                        .move(t);
                });

                // continue

                requestAnimationFrame(animate);
            }
            else {
                animating = false;
                start = null;
            } // else
        }

        function checkAnimation() {
            if (!animating) {
                animating = true;

                requestAnimationFrame(animate);
            } // if
        }

        // the tag class

        var tag = function (ele, x, y, z, ttl) {
            this.ele = ele; // the anchor

            this.x = x;
            this.y = y;
            this.z = z;
            this.ttl = ttl;

            return this;
        };

        tag.prototype = {
            rotateX: function (cos, sin) {
                this.y = this.y * cos - this.z * sin;
                this.z = this.z * cos + this.y * sin;

                return this;
            },

            rotateY: function (cos, sin) {
                this.x = this.x * cos - this.z * sin;
                this.z = this.z * cos + this.x * sin;

                return this;
            },

            move: function (now) {
                // exchange text?

                if (now >= this.ttl) {
                    // set next ttl

                    this.ttl = nextTTL(now);

                    $(this.ele).text(labels[nextIndex]);

                    nextIndex = (nextIndex + 1) % ntags;
                } // if

                var scale = fallLength / (fallLength - this.z);
                var alpha = ((this.z + RADIUS) / (2 * RADIUS)) + 0.5;

                var style = this.ele.style;

                style.fontSize = 15 * scale + "px";
                style.opacity = alpha;
                style.filter = "alpha(opacity = " + alpha * 100 + ")";
                style.zIndex = parseInt(scale * 100);
                style.left = this.x + CX - this.ele.offsetWidth / 2 + "px";
                style.top = this.y + CY - this.ele.offsetHeight / 2 + "px";

                return this;
            }
        };

        // callback

        function onMouseMove(event) {
            var x = event.clientX - EX - CX;
            var y = event.clientY - EY - CY;

            angleY = x * 0.0001;
            angleX = y * 0.0001;

            checkAnimation();
        }

        // add event listener

        if ("addEventListener" in window)
            paper.addEventListener("mousemove", onMouseMove);
        else
            paper.attachEvent("onmousemove", onMouseMove);

        // get goin'

        setup();

        checkAnimation();
    }
})(jQuery);