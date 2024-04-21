import { createContext, useContext, useState } from "react"

export type SearchContextType = {
  searchBoxHasPriority: boolean
  setSearchBoxHasPriority: (priority: boolean) => void
}

const Context = createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchBoxHasPriority, setSearchBoxHasPriority] = useState(false)
  return (
    <Context.Provider value={{searchBoxHasPriority, setSearchBoxHasPriority}}>
      {children}
    </Context.Provider>
  )
}

export function useSearchContext() {
  return useContext(Context)
}
