const API_KEY = '29ba832e6080e3ba17fa45f776857ad2507a0b25019c9f23db61f0b7a06a6b34';

const tickersHandlers = new Map();
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

const AGGREGATE_INDEX = "5";

socket.addEventListener('message', e => {
  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = JSON.parse(e.data);
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlres = tickersHandlers.get(currency) || [];
  handlres.forEach(fn => fn(newPrice));
});

function sendToWebSocket(message) {
  const stringifyMessage = JSON.stringify(message);
  if (socket.readyState == WebSocket.OPEN) {
    socket.send(stringifyMessage);
  }
  socket.addEventListener('open', () => {
    socket.send(stringifyMessage);
  }, { once: true });
}

function subscribToTickerOnWs(ticker) {
  const message = {
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  };
  sendToWebSocket(message);
}

function unSubscribFromTickerOnWs(ticker) {
  const message = {
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  };
  sendToWebSocket(message);
}



export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribToTickerOnWs(ticker);
};

export const unSubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unSubscribFromTickerOnWs(ticker);
};