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
import { Warscrolls } from './warscrolls/data';
import { toDisplay, toStandard } from './utils';

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
  const standardisedSlug = toStandard(slug)
  const matches = Object.keys(Warscrolls).filter(name => toStandard(name).includes(standardisedSlug))
  const pageName = toDisplay(slug)

  return (
    <div className="App">
      <header className="App-header">
        <h1>{ pageName }</h1>
        <p>{ matches }</p>
      </header>
    </div>
  );
}

export default App;
