const API_KEY = '29ba832e6080e3ba17fa45f776857ad2507a0b25019c9f23db61f0b7a06a6b34';

const tickersHandlers = new Map();

const loadTickers = () => {
  if (tickersHandlers.size == 0) {
    return;
  }

  fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(",")}&tsyms=USD&api_key=${API_KEY}`)
    .then(r => r.json())
    .then(rawData => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlres = tickersHandlers.get(currency) || [];
        handlres.forEach(fn => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unSubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);