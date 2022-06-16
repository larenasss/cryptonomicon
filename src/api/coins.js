const getAllCoins = () => {
  const coins = fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
    .then(response => response.json())
    .then(coins => Object.keys(coins.Data).map(c => c));
  return coins;
};

export {
  getAllCoins
};