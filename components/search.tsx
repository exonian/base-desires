import { useCallback, useRef, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { MdClear } from "react-icons/md"
import { useRouter } from 'next/router'

import { toStandard, withoutHyphens } from "../utils/text"
import { usePathname, useSearchParams } from 'next/navigation';
import { useSearchContext, SearchContextType } from '../context/search';


export const SearchBox: React.FC = () => {

  const inputElement = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState('')
  const {searchBoxHasPriority, setSearchBoxHasPriority} = useSearchContext() as SearchContextType
  const slug = searchParams.get('s') || ""
  const searchVal = searchBoxHasPriority ? searchTerm : withoutHyphens(slug)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    setSearchBoxHasPriority(true)
    const newPath = pathname + '?' + createQueryString('s', toStandard(value))
    router.push(newPath, undefined, { shallow: true })
  }

  const handleClear = () => {
    setSearchTerm('')
    setSearchBoxHasPriority(true)
    inputElement?.current?.focus()
    router.push('')
  }

  return (
    <div className="form-row align-items-center">
      <div className="col"></div>
      <div className="col-8">
        <div className="input-group mb-3 mt-3">
          <span className="input-group-text"><FaSearch /></span>
          <input className="form-control" ref={inputElement} value={searchVal} onChange={handleChange} autoFocus />
          { searchVal && (
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
