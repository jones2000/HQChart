(function (global) {
    global.Cross = {
        signalHandler: {},
        on: function (signal, func) {
            this.signalHandler[signal] = func;
        },
        call: function (win, domain, signal, data, callbackfunc) {
            var notice = { "signal": signal, "data": data };
            if (!!callbackfunc) {
                notice["callback"] = "callback_" + new Date().getTime();
                Cross.on(notice["callback"], callbackfunc);
            }
            var noticeStr = JSON.stringify(notice);
            win.postMessage(noticeStr, domain);
        }
    };
    $(window).on("message", function (e) {
        var realEvent = e.originalEvent,
            data = realEvent.data,
            swin = realEvent.source,
            origin = realEvent.origin,
            protocol;
        try {
            protocol = JSON.parse(data);
            var result = global.Cross.signalHandler[protocol.signal].call(null, protocol.data);
            if (!!protocol["callback"]) {
                Cross.call(swin, origin, protocol["callback"], { result: result });
            }
            if (/^callback_/.test(protocol.signal)) {
                delete Cross.signalHandler[protocol.signal];
            }
        } catch (e) {
            console.log(e);
            throw new Error("cross error.");
        }
    });
})(window);