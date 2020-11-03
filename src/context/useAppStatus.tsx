import React, { useEffect, useMemo, useState } from 'react'

interface IAppStatusProvider {
  isOffline: boolean
  isOnline: boolean
}

const timeout = (ms: number, promise: Promise<any>) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('timeout'))
    }, ms)
    promise.then(resolve, reject)
  })
}

const AppStatusContext = React.createContext<IAppStatusProvider | void>(undefined)

const AppStatusProvider: React.FC = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false)

  const setOffline = () => {
    console.log('App is running in offline mode.')
    setIsOffline(true)
  }

  useEffect(() => {
    window.addEventListener('isOffline', setOffline)

    const poll = async () => {
      try {
        await timeout(
          10000,
          fetch('https://example.com', {
            method: 'GET',
            mode: 'no-cors',
            headers: { 'Access-Control-Allow-Origin': '*' },
          })
        )
      } catch (error) {
        if (!isOffline) setOffline()
      }
    }

    poll() // See if we're on the Internet

    return () => {
      window.removeEventListener('isOffline', setOffline)
    }
  })

  const value = useMemo(
    () => ({
      isOffline,
      isOnline: !isOffline,
    }),
    [isOffline]
  )

  return <AppStatusContext.Provider value={value}>{children}</AppStatusContext.Provider>
}

const useAppStatus = () => {
  const context = React.useContext(AppStatusContext)
  if (context === undefined) {
    throw new Error('useAppStatus must be used within a AppStatusProvider')
  }
  return context
}

export { AppStatusProvider, useAppStatus }