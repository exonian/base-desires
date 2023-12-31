import { useCallback, useEffect, useRef, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { MdClear } from "react-icons/md"
import { useRouter } from 'next/router'

import { logToGA } from "../utils/analytics"
import { toStandard, withoutHyphens } from "../utils/text"
import { usePathname, useSearchParams } from 'next/navigation';

export const SearchBox: React.FC = () => {

  const inputElement = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermDefined, setSearchTermDefined] = useState(false)
  const slug = searchParams.get('s') || ""
  const searchVal = searchTermDefined ? searchTerm : withoutHyphens(slug)

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
    setSearchTermDefined(true)
    const newPath = pathname + '?' + createQueryString('s', toStandard(value))
    router.push(newPath, undefined, { shallow: true })
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
    setSearchTermDefined(true)
    inputElement?.current?.focus()
    router.push('')
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
          <span className="input-group-text"><FaSearch /></span>
          <input className="form-control" ref={inputElement} value={searchVal} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} autoFocus />
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
