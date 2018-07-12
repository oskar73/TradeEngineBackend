const WebSocket = require('ws');
const global = require("./config/global")
const { checkPosition } = require("./control/tradeController")

var reconnectInterval = 1000

var getRealtimeData = function (symbols) {
    try {
        const Symbols_total = symbols.map((index) => index.code);
        const Symbols = processArrayInChunks(Symbols_total, 10);
        const ws0 = new WebSocket('wss://marketdata.tradermade.com/feedadv');
        getDataWithSocket(ws0, "siojoFaItCMIapWYVZ_KQ", Symbols[0], Symbols_total);
        if (Symbols.length > 1) {
            const ws1 = new WebSocket('wss://marketdata.tradermade.com/feedadv');
            getDataWithSocket(ws1, "wsWCYzw5ALZPxbCWTDaQ", Symbols[1], Symbols_total);
        }
        if (Symbols.length > 2) {
            const ws2 = new WebSocket('wss://marketdata.tradermade.com/feedadv');
            getDataWithSocket(ws2, "sioKQAikidUqXcatlbOnA", Symbols[2], Symbols_total);
        }

    } catch (error) {
        console.log(`Error | GetFetchData | ${error}`)
    }

};

const getDataWithSocket = (ws, key, data, Symbols_total) => {
    // console.log(data);
    ws.on('open', function open() {
        ws.send(`{"userKey":"${key}", "symbol":"${data}"}`);;
    });

    ws.on('close', function () {
        console.log('socket close : will reconnect in ' + reconnectInterval);
        setTimeout(getRealtimeData, reconnectInterval)
    });

    ws.onmessage = (event) => {
        try {
            if (event.data === "User Key Used to many times") {
                console.log("User Key Used to many times");
                return;
            }
            if (event.data !== "Connected") {
                try {
                    const data = JSON.parse(event.data);
                    // console.log(data);
                    global.bids[Symbols_total.indexOf(data.symbol)] = data.bid;
                    global.asks[Symbols_total.indexOf(data.symbol)] = data.ask;
                    checkPosition();
                } catch (error) {
                    console.log(error);
                }

            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };
};

const processArrayInChunks = (arr, chunkSize) => {
    const result = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        result.push(chunk.join(','));
    }

    return result;
}


module.exports = getRealtimeData;
