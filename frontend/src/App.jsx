import React from 'react';
import BookList from './components/BookList';
import './App.css';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <h1>Book Explorer</h1>
        </header>
        <main>
          <BookList/>
        </main>
      </div>
  );
}

export default App
