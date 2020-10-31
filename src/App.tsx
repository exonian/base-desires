import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useParams,
  useLocation,
  Link,
} from 'react-router-dom';
import { FaLink} from 'react-icons/fa'

import './App.css';
import { Warscrolls } from './warscrolls/data';
import { toDisplay, toStandard } from './utils';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/"><SearchResults /></Route>
        <Route strict path="/:slug/" children={<Warscroll />} />
        <Route path="/:slug" children={<SearchResults />} />
      </Switch>
    </Router>
  )
}

const SearchBox: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    history.push(toStandard(`/${value}`))
  }

  return (
    <input value={searchTerm} onChange={handleChange} autoFocus />
  )
}

const SearchResults = () => {
  const { slug } = useParams()
  const standardisedSlug = slug ? toStandard(slug) : ""
  const matchNames = Object.keys(Warscrolls).filter(name => toStandard(name).includes(standardisedSlug))

  // if (matchNames.length == 1) history.push(`/${toStandard(matchNames[0])}/`)
  return (
    <div className="App">
      <SearchBox />
      <header>
        <h1>Warscrolls</h1>
      </header>
      <ul>
        {matchNames.map((warscroll) =>
          <li key={warscroll}>{warscroll} <Link to={`/${toStandard(warscroll)}/`}><FaLink /></Link></li>
        )}
      </ul>
    </div>
  )
}

const Warscroll = () => {
  const { slug } = useParams()
  const standardisedSlug = slug ? toStandard(slug) : ""
  const exactMatch = Object.keys(Warscrolls).find(name => toStandard(name) == standardisedSlug)

  return exactMatch ? (
    <div className="App">
      <SearchBox />
      <header>
        <h1>{ toDisplay(exactMatch) }</h1>
      </header>
    </div>
  )
  :
  SearchResults()
}

export default App;
