import * as React from 'react' // tslint:disable-line
import * as ReactDOM from 'react-dom'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import {useScroll} from 'react-router-scroll'
import routes from './routes'
import * as ReactGA from 'react-ga'

import './polyfill'

if (__GA_TRACKING_CODE__) {
  ReactGA.initialize(__GA_TRACKING_CODE__)

  browserHistory.listen((location) => {
    ReactGA.pageview(location.pathname)
  })
}

function shouldScrollUp(previousProps, {location}) {
  return location.hash === '' && (previousProps === null || previousProps.location.pathname !== location.pathname)
}

ReactDOM.render(
  (
    <Router
      routes={routes}
      history={browserHistory}
      render={applyRouterMiddleware(useScroll(shouldScrollUp))}
    />
  ),
  document.getElementById('root')
)
