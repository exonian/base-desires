
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

export const SearchResults = () => {
  const { slug } = useParams()
  const standardisedSlug = slug ? toStandard(slug) : ""
  const matches = Object.entries(Warscrolls).reduce((accum, [name, warscroll]) => {
    const otherFields = `${warscroll.faction} || ${warscroll.baseSize} || ${warscroll.notes}`
    if (toStandard(name).includes(standardisedSlug)) accum['name'][name] = warscroll
    else if (toStandard(otherFields).includes(standardisedSlug)) accum['other'][name] = warscroll
    return accum
  }, {'name': {}, 'other': {}} as {'name': TWarscrolls, 'other': TWarscrolls})
  const warscrolls = { ...matches['name'], ...matches['other']}

  return (
    <Page warscrolls={warscrolls} showSearch={true} linkToWarscrolls={true} slug={standardisedSlug} />
  )
}
