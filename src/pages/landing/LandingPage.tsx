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
          <h2>A hands-on tutorial for the Apollo Client</h2>
        </header>
        <dl className={styles.contents}>
          <dt>
            <h3>Overview</h3>
              <p>Get a broad overview of the goals and prerequisites for this hands-on tutorial to the Apollo Client and get to know the Pokedex app we will build together. You can use the included GraphQL backend to get the most out of this tutorial and follow along in several practical steps that will lead to a fully functional Pokedex app! As Apollo is a GraphQL client, this introduction focuses on the client side. However, you can connect your application to your very own GraphQL endpoint and access the data with the integrated data browser.</p>
          </dt>
          <dt>
            <h3>Tutorial Tracks</h3>
              <p>This tutorial includes tracks for React, Angular 2 and React Native! You will be guided on a step-by-step basis from a basic starter-kit application to a complete Pokedex application using your favorite JavaScript technology. Finish multiple tutorial tracks to increase your understanding in React, Angular 2 or React Native. The exercises cover different concepts specific to GraphQL or the Apollo Client. Learn about GraphQL queries and how to use fragments to encapsulate data requirements. See how single or multiple mutations work. Find out about  powerful pagination using GraphQL and the Apollo Client.</p>
          </dt>
          <dt>
            <h3>Excursions</h3>
              <p>Several excursions are also provided zooming in on specific topics such as improving your development workflow with the Redux DevTools or controlling the Apollo Client Store with mutation results and optimistic UI</p>
          </dt>
        </dl>
        <div className={styles.start}>
          <Link to={`/${chapters[0].alias}/${chapters[0].subchapters[0].alias}`}>Start interactive tutorial</Link>
        </div>
      </div>
    )
  }
}
