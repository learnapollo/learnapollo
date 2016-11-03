import * as React from 'react'
import {Link} from 'react-router'
import {chapters} from '../../utils/content'
const styles: any = require('./LandingPage.module.styl')

interface Props {
  params: any
}

export default class LandingPage extends React.Component<Props, {}> {

  render() {
    return (
      <div className={styles.root}>
        <header>
          <h1>Learn Apollo</h1>
          <h2>A hands-on tutorial for the Apollo Client in React, Angular 2 and React Native</h2>
        </header>
        <dl className={styles.contents}>
          <dt>
            <h3>Apollo Client Tutorial for React, Angular 2 and React Native</h3>
            <p>Get a broad overview of the goals and prerequisites for this hands-on tutorial to the Apollo Client and get to know the Pokedex app we will build together. You can use the included GraphQL backend to get the most out of this tutorial and follow along in several practical steps that will lead to a fully functional Pokedex app! This tutorial includes tracks for React, Angular 2 and React Native!</p>

            <p>As Apollo is a GraphQL client, this introduction focuses on the client side. The pokedex application will be build in multiple steps</p>

            <p>Several excursions are also provided covering topics such as the Redux DevTools and controlling the Apollo Client Store with mutation results.</p>
          </dt>
        </dl>
        <div className={styles.start}>
          <Link to={`/${chapters[0].alias}/${chapters[0].subchapters[0].alias}`}>Start interactive tutorial</Link>
        </div>
      </div>
    )
  }
}
