import { camelCase, startCase } from 'lodash'
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useParams,
} from 'react-router-dom';

import './App.css';
import { Warscrolls } from './warscrolls/data';
import { toDisplay, toStandard } from './utils';
import { exact } from 'prop-types';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/"><Search /></Route>
        <Route strict path="/:slug/" children={<Warscroll />} />
        <Route path="/:slug" children={<Search />} />
      </Switch>
    </Router>
  )
}

const Search = () => {
  const history = useHistory()
  const { slug } = useParams()
  const standardisedSlug = slug ? toStandard(slug) : ""
  const matchNames = Object.keys(Warscrolls).filter(name => toStandard(name).includes(standardisedSlug))
  // const exactMatch = matchNames.filter(name => toStandard(name) == standardisedSlug)

  // if (exactMatch.length) history.push(`/${exactMatch}/`)
  if (matchNames.length == 1) history.push(`/${toStandard(matchNames[0])}/`)
  return (
    <div className="App">
      <header>
        <h1>Warscrolls</h1>
      </header>
      <ul>
        {matchNames.map((warscroll) =>
          <li key={warscroll}>{warscroll}</li>
        )}
      </ul>
    </div>
  )
}

const Warscroll = () => {
  const history = useHistory()
  const { slug } = useParams()
  const standardisedSlug = slug ? toStandard(slug) : ""
  const exactMatch = Object.keys(Warscrolls).find(name => toStandard(name) == standardisedSlug)

  return exactMatch ? (
    <div className="App">
      <header>
        <h1>{ toDisplay(exactMatch) }</h1>
      </header>
    </div>
  )
  :
  Search()
}

export default App;
