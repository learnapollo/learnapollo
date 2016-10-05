import * as React from 'react' // tslint:disable-line
import * as ReactDOM from 'react-dom'
import {Router, browserHistory, applyRouterMiddleware} from 'react-router'
import {useScroll} from 'react-router-scroll'
import * as cuid from 'cuid'
import loadAnalytics from './utils/analytics'
import routes from './routes'
import * as Cookies from 'js-cookie'
import {getStoredState} from './utils/statestore'

import './polyfill'

loadAnalytics()

function trackHistory () {
  browserHistory.listen(({pathname}) => {
    analytics.track(`view: ${pathname}`)
    analytics.page()
  })
}

analytics.ready(() => {
  const storedState = getStoredState()
  if (storedState.user) {
    analytics.identify(storedState.user.email, trackHistory)
  } else {
    if (!Cookies.get('learnapollo_guestid')) {
      Cookies.set('learnapollo_guestid', cuid())
      analytics.alias(Cookies.get('learnapollo_guestid'), trackHistory)
    } else {
      analytics.identify(Cookies.get('learnapollo_guestid'), trackHistory)
    }
  }
})

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
