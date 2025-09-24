import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ApiErrorBoundary from './components/ApiErrorBoundary';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Certificates from './pages/Certificates';
import Documentation from './pages/Documentation';
import Videos from './pages/Videos';
import Requisites from './pages/Requisites';
import Support from './pages/Support';
import Buy from './pages/Buy';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <ApiErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/requisites" element={<Requisites />} />
              <Route path="/support" element={<Support />} />
              <Route path="/buy" element={<Buy />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ApiErrorBoundary>
  );
};

export default App;
