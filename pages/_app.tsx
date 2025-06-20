import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { GoogleAnalytics } from '@next/third-parties/google'
import { SearchProvider } from '../context/search'

const ga_ID = process.env.NEXT_PUBLIC_GA_ID || ""

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SearchProvider>
        <Component {...pageProps} />
      </SearchProvider>
      <GoogleAnalytics gaId={ ga_ID } />
    </>
  )
}

export default MyApp
