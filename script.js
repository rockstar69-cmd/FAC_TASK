// Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
const apiKey = '9JNHDVWZEIUSJHTS';

function searchStock() {
  const symbolInput = document.getElementById('stockSymbol');
  const symbol = symbolInput.value.trim().toUpperCase();

  if (symbol) {
    fetchStockData(symbol);
  }
}

function fetchStockData(symbol) {
  const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const stockData = transformData(data);
      drawChart(stockData, symbol);
    })
    .catch(error => console.log(error));
}

function transformData(data) {
  const timeSeries = data['Time Series (1min)'];
  const stockData = [];

  for (const key in timeSeries) {
    const date = new Date(key);
    const close = parseFloat(timeSeries[key]['4. close']);
    stockData.push({ x: date, y: close });
  }

  return stockData;
}

function drawChart(data, symbol) {
  const chart = new CanvasJS.Chart('chartContainer', {
    theme: 'dark1',
    title: {
      text: `${symbol} Stock Price`
    },
    
    axisX: {
      title: 'Time'
    },
    axisY: {
      title: 'Price',
      includeZero: false
    },
    data: [{
      type: 'line',
      dataPoints: data,
      color: 'yellow'
    }]
  });

  chart.render();
}

// Initial fetch for default stock (AAPL)
fetchStockData('AAPL');
setInterval(() => fetchStockData('AAPL'), 60000);



