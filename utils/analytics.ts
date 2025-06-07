import ReactGA from 'react-ga4'
import { isProd, isTest, isDev } from "./env";

if (!isTest && process.env.REACT_APP_GA_ID) {
  ReactGA.initialize(process.env.REACT_APP_GA_ID)
}
  
/**
 * Generic wrapper for logging events
 * Will print to console in dev, will actually log in prod
 */
export const logToGA = (event: { category: string; action: string; label: string }) => {
  if (isDev) {
    console.log(`GA Event: `, event)
  } else if (isProd) {
    ReactGA.event(event)
  }
}