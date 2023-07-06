import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from 'src/routes';
import 'src/App.scss';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
};

export default App;
