import './App.css';
import Home from './components/Home';
import BlogState from './context/BlogState';

function App() {
  return (
    <BlogState>
      <Home />
    </BlogState>
  );
}

export default App;
