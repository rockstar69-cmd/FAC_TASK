const apiKey = '1P3KUXEAYSWMAQR3'; // Replace with your actual API key



// Function to fetch real-time stock data
async function fetchStockData(symbol) {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
    const data = await response.json();

    if (data['Global Quote']) {
      return {
        symbol: data['Global Quote']['01. symbol'],
        currentPrice: parseFloat(data['Global Quote']['05. price'])
      };
    } else {
      throw new Error('Failed to fetch stock data.');
    }
  } catch (error) {
    throw new Error('Failed to fetch stock data.');
  }
}

// Function to calculate profit/loss
function calculateProfitLoss(avgPrice, currentPrice, quantity) {
  const costBasis = avgPrice * quantity;
  const marketValue = currentPrice * quantity;
  const profitLoss = marketValue - costBasis;
  const percentage = ((profitLoss / costBasis) * 100).toFixed(2);

  return {
    profitLoss,
    percentage
  };
}

// Function to buy stocks
async function buyStock() {
  const symbolInput = document.getElementById('symbol');
  const quantityInput = document.getElementById('quantity');
  const symbol = symbolInput.value.toUpperCase();
  const quantity = parseInt(quantityInput.value);

  try {
    const stock = await fetchStockData(symbol);

    const totalPrice = stock.currentPrice * quantity;

    // Check if available funds are sufficient
    const availableFunds = parseFloat(document.getElementById('availableFunds').textContent);
    if (totalPrice > availableFunds) {
      alert('Insufficient funds.');
      return;
    }

    // Update available funds
    document.getElementById('availableFunds').textContent = (availableFunds - totalPrice).toFixed(2);

    // Calculate average price and total shares
    const stockTable = document.getElementById('stockTable');
    const rows = stockTable.getElementsByTagName('tr');
    let avgPrice = 0;
    let totalShares = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const avgPriceCell = row.getElementsByTagName('td')[2];
      const sharesCell = row.getElementsByTagName('td')[1];
      const rowAvgPrice = parseFloat(avgPriceCell.textContent);
      const rowShares = parseInt(sharesCell.textContent);
      avgPrice += rowAvgPrice * rowShares;
      totalShares += rowShares;
    }

    totalShares += quantity;
    avgPrice = (avgPrice + stock.currentPrice * quantity) / totalShares;

    // Calculate profit/loss
    const { profitLoss, percentage } = calculateProfitLoss(avgPrice, stock.currentPrice, quantity);

    // Update stock table
    const row = stockTable.insertRow(-1);
    row.innerHTML = `
      <td>${stock.symbol}</td>
      <td>${quantity}</td>
      <td>${avgPrice.toFixed(2)}</td>
      <td>${stock.currentPrice.toFixed(2)}</td>
      <td>${profitLoss.toFixed(2)} (${percentage}%)</td>
    `;

    // Calculate and update net profit/loss
    const netProfitLoss = calculateNetProfitLoss();
    document.getElementById('netProfitLoss').textContent = netProfitLoss.toFixed(2);

    // Clear input fields
    symbolInput.value = '';
    quantityInput.value = '';
  } catch (error) {
    alert('Failed to fetch stock data. Please try again.');
  }
}

// Function to calculate net profit/loss
function calculateNetProfitLoss() {
  const stockTable = document.getElementById('stockTable');
  const rows = stockTable.getElementsByTagName('tr');
  let netProfitLoss = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const profitLossCell = row.getElementsByTagName('td')[4];
    const profitLossText = profitLossCell.textContent;
    const profitLoss = parseFloat(profitLossText.substring(0, profitLossText.indexOf('(')).trim());
    netProfitLoss += profitLoss;
  }

  return netProfitLoss;
}
