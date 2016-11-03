import * as React from 'react' // tslint:disable-line
import {Route} from 'react-router'
import MarkdownPage from './pages/markdown/MarkdownPage'
import LandingPage from './pages/landing/LandingPage'
import App from './components/App/App'
import {subchapters} from './utils/content'

export default (
  <Route component={App}>
    <Route path='/' component={LandingPage}/>
    <Route
      path='/:chapter/:subchapter'
      component={({ params, location }) => (
        <MarkdownPage
          params={params}
          location={location}
          ast={subchapters.find((s) => s.alias === params.subchapter)!.ast()}
          sourceName={`${params.chapter}/${params.subchapter}.md`}
        />
      )}
    />
  </Route>
)
