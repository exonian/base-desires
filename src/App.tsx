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
import { FaLink, FaHome} from 'react-icons/fa'

import './App.css';
import { Warscrolls } from './warscrolls/data';
import { toDisplay, toStandard } from './utils';
import { TWarscroll, TWarscrolls } from './warscrolls/types';

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
  const warscrollNames = Object.keys(Warscrolls).filter(name => toStandard(name).includes(standardisedSlug))
  const warscrolls = warscrollNames.reduce((accum, warscrollName) => {
    accum[warscrollName] = Warscrolls[warscrollName]
    return accum
  }, {} as TWarscrolls)

  return (
    <div className="App">
      <SearchBox />
      <header>
        <h1>Warscrolls</h1>
      </header>
      <ul>
        {Object.entries(warscrolls).map(([name, warscroll]) =>
          <li key={name}>
            <p><Link to={`/${toStandard(name)}/`}>{name}</Link></p>
            <p>{ warscroll.baseSize }</p>
            { warscroll.notes && <p>{ warscroll.notes }</p>}
          </li>
        )}
      </ul>
    </div>
  )
}

const Warscroll = () => {
  const { slug } = useParams()
  const standardisedSlug = slug ? toStandard(slug) : ""
  const warscrollName = Object.keys(Warscrolls).find(name => toStandard(name) == standardisedSlug)
  const warscroll = warscrollName && Warscrolls[warscrollName]

  return (warscrollName && warscroll) ? (
    <div className="App">
      <Link to={"/"}><FaHome /></Link>
      <header>
        <h1>{ warscrollName }</h1>
        <h2>{ warscroll.baseSize }</h2>
        { warscroll.notes && <p>{ warscroll.notes }</p>}
      </header>
    </div>
  )
  :
  SearchResults()
}

export default App;
