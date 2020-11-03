import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
  useParams,
  Link,
} from 'react-router-dom';
import { FaSearch, FaTwitter, FaGithub } from 'react-icons/fa'
import { MdClear } from 'react-icons/md'
import qs from 'qs'

import { logPageView, logToGA } from './utils/analytics'
import { toStandard } from './utils/text';
import { Warscrolls } from './warscrolls/data';
import { TWarscrolls, TWarscroll } from './warscrolls/types';
import { useAppStatus } from './context/useAppStatus';

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

  const inputElement = useRef<HTMLInputElement>(null)
  const history = useHistory()
  const { slug } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  if (!searchTerm && slug) setSearchTerm(slug)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    history.push(toStandard(`/${value}`))
  }

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    logToGA({
      category: `Unit name`,
      action: `Search blur`,
      label: `${value}`,
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement
      logToGA({
        category: `Unit name`,
        action: `Search enter`,
        label: `${target.value}`,
      })
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    inputElement?.current?.focus()
    history.push('')
    logToGA({
      category: `Unit name`,
      action: `Search clear`,
      label: ``,
    })
  }

  return (
    <div className="form-row align-items-center">
      <div className="col"></div>
      <div className="col-8">
        <div className="input-group mb-3 mt-3">
          <div className="input-group-prepend">
            <div className="input-group-text"><FaSearch /></div>
          </div>
          <input className="form-control" ref={inputElement} value={searchTerm} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} autoFocus />
          { searchTerm && (
            <div className="input-group-append">
              <button className="input-group-text btn btn-outline-secondary" type="button" onClick={handleClear} ><MdClear /></button>
            </div>
          )}
        </div>
      </div>
      <div className="col"></div>
    </div>
  )
}

interface ICardProps {
  name: string
  warscroll: TWarscroll
  link: boolean
}

const Card: React.FC<ICardProps> = props => {
  const { name, warscroll, link } = props

  return (
    <div className="card warscroll-card mb-3">
      <div className="card-body">
        <h2>{ link ? <Link to={`/${toStandard(name)}/`}>{name}</Link> : <>{name}</>}</h2>
        <p className="card-text">{ warscroll.baseSize }</p>
        { warscroll.notes && <p className="card-text card-notes">{ warscroll.notes }</p>}
      </div>
    </div>
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
    <Page warscrolls={warscrolls} showSearch={true} linkToWarscrolls={true} />
  )
}

const Warscroll = () => {
  const { slug } = useParams()
  const standardisedSlug = slug ? toStandard(slug) : ""
  const name = Object.keys(Warscrolls).find(name => toStandard(name) === standardisedSlug)
  const warscroll = name && Warscrolls[name]
  const warscrolls: TWarscrolls = {}
  if (name && warscroll) warscrolls[name] = warscroll

  return (name && warscroll) ? (
    <Page warscrolls={warscrolls} showSearch={false} linkToWarscrolls={false} />
  )
  :
  SearchResults()
}

interface IPageProps {
  warscrolls: TWarscrolls
  showSearch: boolean
  linkToWarscrolls: boolean
}

const Page: React.FC<IPageProps> = props => {
  const { warscrolls, showSearch, linkToWarscrolls } = props

  const cardColumnStyle = (Object.keys(warscrolls).length > 1) ? "col-md-6" : "col-12"

  useEffect(() => {
    logPageView()
  }, [])

  const { isOnline } = useAppStatus()
  const { showStatus = false } = qs.parse(window.location.search, { ignoreQueryPrefix: true })

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container pt-3 flex-fill">
        <h1><Link to={"/"}>Base Desires</Link></h1>
        <div className="sticky-top bg-body">
          { showSearch && <SearchBox /> }
        </div>
        <div className="row">
          {Object.entries(warscrolls).map(([name, warscroll]) =>
            <div className={cardColumnStyle} key={name}>
              <Card name={name} warscroll={warscroll} link={linkToWarscrolls} />
            </div>
          )}
        </div>
      </div>
      <footer className="footer text-center">
        <p>By Michael Blatherwick
          <a className="social-link" href="https://twitter.com/rogue_michael"><FaTwitter /> @rogue_michael</a>
          <a className="social-link" href="https://github.com/exonian"><FaGithub /> exonian</a>
        </p>
        <blockquote className="blockquote pr-3">
          <p className="mb-0">"basedesires.com. Haha can you imagine if that was a website about Warhammer bases…"</p>
          <footer className="blockquote-footer">Me a few days ago...</footer>
        </blockquote>
        { showStatus && <p className={`badge badge-primary badge-${ isOnline ? 'success' : 'warning' }`}>{ isOnline ? "Online" : "Offline" }</p> }
      </footer>
    </div>
  )
}

export default App;
