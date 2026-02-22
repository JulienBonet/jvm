import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home/Home';
import Artists from '../pages/Artists/Artists';
import Labels from '../pages/Labels/Labels';
import NotFound from '../pages/NotFound/NotFound';
import ReleasesByArtist from '../pages/ReleasesByArtist/ReleasesByArtist';
import ReleasesByLabel from '../pages/ReleasesByLabel/ReleasesByLabel';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/artists',
        element: <Artists />,
      },
      {
        path: '/labels',
        element: <Labels />,
      },
      {
        path: '/artist/:id',
        element: <ReleasesByArtist />,
      },
      {
        path: '/label/:id',
        element: <ReleasesByLabel />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
