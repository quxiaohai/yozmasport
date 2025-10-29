const $heybike = {
    _events: {},
    _domLoaded: false,
    _loaded: false,
    _timer: null,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    isMobile: /android|iphone|ipad|ipod|micromessenger/gi.test(navigator.userAgent.toLocaleLowerCase()) || window.innerWidth <= 1023,
    on: (event, fn, node) => {
        if (!node) {
            switch (event) {
                case "resize":
                case "load":
                    node = window;
                    break;
                case "click":
                    node = document.body;
                    break;
                default:
                    node = document;
                    break;
            }
        }
        if (!$heybike._events[event]) {
            $heybike._events[event] = [{node, fns: []}];
        }

        const info = $heybike._events[event].find(item => item.node === node);

        if (info.fns.length === 0) {
            if (event === "resize") {
                let _timer = null;
                node.addEventListener("resize", function () {
                    clearTimeout(_timer);
                    _timer = setTimeout(() => {
                        $heybike.screenWidth = window.innerWidth;
                        $heybike.screenHeight = window.innerHeight;
                        $heybike.isMobile = /android|iphone|ipad|ipod|micromessenger/gi.test(navigator.userAgent.toLocaleLowerCase()) || $narwal.screenWidth <= 1023;
                        info.fns.forEach(fn => {
                            fn && fn({
                                mode: $heybike.isMobile ? "h5" : "pc"
                            });
                        });
                    }, 100);
                });
            } else if (event === "scroll") {
                const isDoc = node === document;
                node.addEventListener("scroll", function () {
                    const left = isDoc ? window.scrollX || document.documentElement.scrollLeft : node.scrollLeft;
                    const top = isDoc ? window.scrollY || document.documentElement.scrollTop : node.scrollTop;
                    info.fns.forEach(fn => {
                        fn && fn({
                            left,
                            top
                        });
                    });
                });
            } else {
                node.addEventListener(event, function (ev) {
                    info.fns.forEach(fn => {
                        fn && fn(ev);
                    });
                });
            }
        }

        info.fns.push(fn);

        if ($heybike._domLoaded && event === "DOMContentLoaded") {
            fn && fn();
        } else if ($heybike._loaded && event === "load") {
            fn && fn();
        }
    },
    bind: (key, fn) => {
        if (!$heybike._events[key]) {
            $heybike._events[key] = [];
        }
        $heybike._events[key].push(fn);
    },
    emit: (key, data) => {
        return new Promise(resolve => {
            const list = $heybike._events[key];
            if (list) {
                list.forEach(fn => {
                    fn && fn(data);
                });
                resolve(true);
            } else {
                resolve(false);
            }
        });
    },
    getNodeList: (node) => {
        var list = Array.prototype.slice.call(node.querySelectorAll("[node-name]"), 0);
        var nodeList = {};

        list.forEach(function (el) {
            var name = el.getAttribute("node-name");

            if (name in nodeList) {
                nodeList[name] = [].concat(nodeList[name], el);
            } else {
                nodeList[name] = el;
            }
        });

        return nodeList;
    },
    getOffset: el => {
        let body = document.body;
        el = el || body;
        let box = el.getBoundingClientRect();
        let clientTop = el.clientTop || body.clientTop || 0;
        let clientLeft = el.clientLeft || body.clientLeft || 0;
        let scrollTop = window.scrollY || el.scrollTop;
        let scrollLeft = window.scrollX || el.scrollLeft;
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft,
            scrollTop,
            scrollLeft
        };
    },
    popup(option) {
        let node = null;
        1;
        if (option.html) {
            const elem = document.createElement("div");
            elem.innerHTML = option.html;
            node = elem.querySelector(".m-popup");
            document.body.appendChild(elem);
        } else {
            node = document.querySelector(option.selector);
        }

        const nodeList = $narwal.getNodeList(node);
        const onClose = () => {
            node.classList.remove("visible");
            setTimeout(() => {
                node.classList.remove("show");
                document.body.style.overflow = "";
                option.onClose && option.onClose(nodeList);
            }, 300);
        };

        const onShow = () => {
            node.classList.add("show");
            document.body.style.overflow = "hidden";
            setTimeout(() => {
                node.classList.add("visible");
                option.onShow && option.onShow(nodeList);
            }, 20);
        };

        nodeList.popup_close && nodeList.popup_close.addEventListener("click", function () {
            onClose();
        });

        return {
            onShow,
            onClose,
            nodeList,
            onScript(fn) {
                fn && fn(nodeList);
            }
        };
    },
    load(type, fn) {

    },
    addToCart() {

    }
};