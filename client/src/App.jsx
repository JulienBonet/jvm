import { Outlet } from 'react-router-dom';
import { FormatProvider } from './context/FormatContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <FormatProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </FormatProvider>
  );
}

export default App;
