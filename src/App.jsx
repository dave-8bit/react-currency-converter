import { useState, useEffect } from 'react';
import CurrencyInput from './CurrencyInput.jsx';
import './App.css'; 
const API_KEY = import.meta.env.VITE_API_KEY; 
const API_BASE = import.meta.env.VITE_API_BASE;
function App() {
  const [amount1, setAmount1] = useState(100);
  const [amount2, setAmount2] = useState(0);
  const [currency1, setCurrency1] = useState('USD');
  const [currency2, setCurrency2] = useState('NGN');
  const [currencyOptions, setCurrencyOptions] = useState([]); 
  const [rates, setRates] = useState({}); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    setIsLoading(true); 

    fetch(`${API_BASE}/${API_KEY}/codes`)
      .then((res) => res.json())
      .then((data) => {
        const codes = data.supported_codes.map(code => code[0]);
        setCurrencyOptions(codes);
        setIsLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching currency codes:", error);
        setIsLoading(false); 
      });
  }, []); 

  useEffect(() => {
    if (!currency1) return; 

    setIsLoading(true); 

    fetch(`${API_BASE}/${API_KEY}/latest/${currency1}`)
      .then((res) => res.json())
      .then((data) => {
        setRates(data.conversion_rates); 
        setIsLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching exchange rates:", error);
        setIsLoading(false);
      });
  }, [currency1]); 

  useEffect(() => {
    if (rates && rates[currency2]) {
      setAmount2((amount1 * rates[currency2]).toFixed(2));
    }
  }, [rates, currency2, amount1]); 

  const handleSwap = () => {
    // Corrected: Removed the unused 'tempAmount' variable
    const tempCurrency = currency1;
    setCurrency1(currency2);
    setCurrency2(tempCurrency);

    setAmount1(amount2);
  };
  
  function handleAmount1Change(newAmount1) {
    newAmount1 = Number(newAmount1);
    setAmount1(newAmount1);
    if (rates && rates[currency2]) {
      setAmount2((newAmount1 * rates[currency2]).toFixed(2));
    }
  }

  function handleAmount2Change(newAmount2) {
    newAmount2 = Number(newAmount2);
    setAmount2(newAmount2);
    if (rates && rates[currency2]) {
      setAmount1((newAmount2 / rates[currency2]).toFixed(2));
    }
  }

  return (
    <>
      <h1>Currency Converter</h1>
      
      {isLoading ? (
        <div className="loading-message">Loading currency data...</div>
      ) : (
        <div className="converter-body"> 
          <CurrencyInput
            currencies={currencyOptions}
            amount={amount1}
            currency={currency1}
            onAmountChange={handleAmount1Change}
            onCurrencyChange={(newCurrency) => setCurrency1(newCurrency)}
          />
          
          <div className="swap-controls">
            <button onClick={handleSwap} className="swap-button">
              ⇅
            </button>
            <div className="equals">=</div>
          </div>
          
          <CurrencyInput
            currencies={currencyOptions}
            amount={amount2}
            currency={currency2}
            onAmountChange={handleAmount2Change}
            onCurrencyChange={(newCurrency) => setCurrency2(newCurrency)}
          />
        </div>
      )}
      
      {/* Rate display section */}
      {!isLoading && rates && (
        <p className="rate-info">
          1 {currency1} ={" "}
          {rates[currency2] && rates[currency1]
            ? (rates[currency2] / rates[currency1]).toFixed(4)
            : "..."}{" "}
          {currency2}
        </p>
      )}
    </>
  );
}

export default App;