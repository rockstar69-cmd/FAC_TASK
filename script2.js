// Replace 'YOUR_API_KEY' with your actual Alpha Vantage API key
const apiKey = '9JNHDVWZEIUSJHTS';

let selectedCompany = 'AAPL'; // Default selected company symbol

// Fetch stock data from Alpha Vantage API
function fetchStockData() {
  const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedCompany}&interval=1min&apikey=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const stockData = transformData(data);
      drawChart(stockData);
    })
    .catch(error => console.log(error));
}

// Transform raw stock data into a format suitable for the chart
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

// Draw the chart using CanvasJS library
function drawChart(data) {
  const chart = new CanvasJS.Chart('chartContainer', {
    theme: 'light2',
    title: {
      text: `${selectedCompany} Stock Price`
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
      dataPoints: data
      
    }]
  });

  chart.render();
}

// Handle company selection change
function onCompanyChange() {
  const companySelect = document.getElementById('companySelect');
  selectedCompany = companySelect.value;
  const companyName = companySelect.options[companySelect.selectedIndex].text;
  document.getElementById('companyName').textContent = `${companyName} Stock Data`;

  fetchStockData();
}

// Fetch stock data for the selected company every minute
fetchStockData();
setInterval(fetchStockData, 60000);
