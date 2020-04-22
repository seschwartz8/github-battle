import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from './contexts/theme';
import Nav from './components/Nav';
import Loading from './components/Loading';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Code splitting telling React not to import each component until it's needed by the Router
const Popular = React.lazy(() => import('./components/Popular'));
const Battle = React.lazy(() => import('./components/Battle'));
const Results = React.lazy(() => import('./components/Results'));

const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      {/* Any component that needs the 'theme' can get it by consuming the provider */}
      <ThemeProvider value={theme}>
        <div className={theme}>
          <div className='container'>
            <Nav toggleTheme={toggleTheme} />

            <React.Suspense fallback={<Loading />}>
              {' '}
              {/*if the components take too long to import, react will show the fallback meanwhile*/}
              <Switch>
                {' '}
                {/*Only renders the first match to prevent 404 from rendering unless no match is found*/}
                <Route exact path='/' component={Popular} />
                <Route exact path='/battle' component={Battle} />
                <Route path='/battle/results' component={Results} />
                <Route render={() => <h1>404</h1>} />
                {/*Would always render if no Switch was used since we left off "path"*/}
              </Switch>
            </React.Suspense>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
