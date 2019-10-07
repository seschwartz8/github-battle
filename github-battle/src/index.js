import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from "./contexts/theme";
import Nav from './components/Nav';
import Loading from './components/Loading';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Code splitting telling React not to import each component until it's needed by the Router
const Popular = React.lazy(() => import('./components/Popular'))
const Battle = React.lazy(() => import('./components/Battle'))
const Results = React.lazy(() => import('./components/Results'))


class App extends Component {
    constructor (props) {
        super(props)

    //put the theme and ability to toggle it here so it can be consumed by any part of the app
    this.state = {
        theme: 'light',
        toggleTheme: () => {
          this.setState(({ theme }) => ({
            theme: theme === 'light' ? 'dark' : 'light'
          }))
        }
      }
    }

    render() {
        return (
            <Router>
                <ThemeProvider value={this.state}>
                    <div className={this.state.theme}>
                        <div className='container'>
                            <Nav />

                            <React.Suspense fallback={<Loading />}> {/*if the components take too long to import, react will show our fallback meanwhile*/}
                                <Switch> {/*Only renders the first match to prevent 404 from rendering unless no match is found*/}
                                    <Route exact path='/' component={Popular} />
                                    <Route exact path='/battle' component={Battle} />
                                    <Route path='/battle/results' component={Results} />
                                    <Route render={() => <h1>404</h1>} /> 
                                        {/*Will always render since we left off "path"*/}
                                </Switch>
                            </React.Suspense>

                        </div>
                    </div>
                </ThemeProvider>
            </Router>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
