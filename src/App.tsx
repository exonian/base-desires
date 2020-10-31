import { camelCase, startCase } from 'lodash'
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from 'react-router-dom';

import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/"><Page /></Route>
        <Route path="/:slug" children={<Page />} />
      </Switch>
    </Router>
  )
}

const Page = () => {
  const { slug } = useParams()
  const pageName = startCase(camelCase(slug))

  return (
    <div className="App">
      <header className="App-header">
        <h1>{ pageName }</h1>
      </header>
    </div>
  );
}

export default App;
