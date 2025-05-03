import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4 text-primary">🧺 Market Basket</h1>
      <p className="lead">Track and compare grocery prices across locations.</p>
    </div>
  );
}

function Search() {
  const [terms, setTerms] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/terms/')
      .then(res => setTerms(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredTerms = terms.filter(term =>
    term.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Search Items</h2>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Type to search for an item..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <ul className="list-group">
        {filteredTerms.length > 0 ? (
          filteredTerms.map(term => (
            <li key={term.id} className="list-group-item">
              <strong>{term.name}</strong> – ${term.price} ({term.brand}, {term.location})
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">No matching items found.</li>
        )}
      </ul>
    </div>
  );
}

function CompareGroceries() {
  const [comparisons, setComparisons] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/item-prices/')
      .then(res => setComparisons(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Compare Grocery Prices</h2>
      <ul className="list-group">
        {comparisons.map((item, idx) => (
          <li key={idx} className="list-group-item">
            <strong>{item.name}</strong><br />
            Local: ${item.your_price} <br />
            Kroger: {item.kroger_price ? `$${item.kroger_price}` : 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SubmitFeedback() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFeedback('');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="4"
            placeholder="Your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">Submit</button>
        {submitted && <div className="mt-3 text-success">✅ Thank you for your feedback!</div>}
      </form>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4 px-4">
          <Link className="navbar-brand" to="/">Market Basket</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/search">Search</Link>
            <Link className="nav-link" to="/compare">Compare</Link>
            <Link className="nav-link" to="/feedback">Feedback</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/compare" element={<CompareGroceries />} />
          <Route path="/feedback" element={<SubmitFeedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
