import { useEffect, useState } from 'react';

const APIKEY = 'fca_live_WWyyg815GnayQU41HfmLWaAs04anndiQNVq9zngZ';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(0);
  const [fromCode, setFromCode] = useState('USD');
  const [toCode, setToCode] = useState('EUR');
  const [converted, setConverted] = useState(null);

  async function convertCurrency(amount, from, to, apiKey) {
    const response = await fetch(
      `https://api.freecurrencyapi.com/v1/latest?apikey=${apiKey}&base_currency=${from}&currencies=${to}`,
    );
    const data = await response.json();
    const rate = data.data[to];
    return (amount * rate).toFixed(2);
  }

  useEffect(() => {
    async function fetchExchangeRates() {
      const result = await convertCurrency(amount, fromCode, toCode, APIKEY);
      setConverted(result);
    }
    fetchExchangeRates();
  }, [amount, fromCode, toCode]);

  return (
    <>
      <div style={{ display: 'flex', gap: '10px' }}>
        <CurrencyInput amount={amount} onSetAmount={setAmount} />
        <SelectInput value={fromCode} onChange={setFromCode} />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <CurrencyOutput amount={converted} />
        <SelectInput value={toCode} onChange={setToCode} />
      </div>
    </>
  );
}

function CurrencyInput({ amount, onSetAmount }) {
  return (
    <input
      type='number'
      value={amount}
      onChange={(e) => onSetAmount(e.target.value)}
    />
  );
}

function CurrencyOutput({ amount }) {
  return <input type='text' value={amount} readOnly />;
}

function SelectInput({ value, onChange }) {
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    async function loadCodes() {
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/currencies?apikey=${APIKEY}`,
      );
      const data = await response.json();
      const currency = Object.keys(data.data);
      setCodes(currency);
    }
    loadCodes();
  }, []);

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {codes.map((code) => (
        <option key={code} value={code}>
          {code}
        </option>
      ))}
    </select>
  );
}
