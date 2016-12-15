import * as React from 'react'
import {Link} from 'react-router'
import {chapters} from '../../utils/content'
const styles: any = require('./LandingPage.module.styl')

interface Props {
  params: any
}

export default class LandingPage extends React.Component<Props, {}> {

  componentDidMount() {
    this.toggleSmoochButton(false)
  }

  componentWillUnmount() {
    this.toggleSmoochButton(true)
  }

  render() {
    return (
      <div className={styles.root}>
        <header>
          <h1>Learn Apollo</h1>
          <h2>A hands-on tutorial for Apollo GraphQL Client</h2>
        </header>
        <dl className={styles.contents}>
          <dt>
            <h3>Overview</h3>
              <p>Get a broad overview of the goals and prerequisites for this hands-on tutorial to Apollo Client and
              get to know the Pokedex app we will build together. You can use the included GraphQL backend to get the
              most out of this tutorial and follow along in several practical steps that will lead to a fully functional
              Pokedex app! As Apollo is a GraphQL client, this introduction focuses on the client side. However, you can
              connect your application to your very own GraphQL endpoint and access the data with the integrated data
              browser.</p>
          </dt>
          <dt>
            <h3>Tutorial Tracks</h3>
              <p>This tutorial includes tracks for React, React Native Vanilla and React Native Exponent,
              and many more are planned! You will be guided on a step-by-step basis from a basic starter-kit
              application to a complete Pokedex application using your favorite JavaScript technology.
              Finish multiple tutorial tracks to increase your understanding in React, React Native or other technologies.
              The exercises cover different concepts specific to GraphQL or Apollo Client. Learn about
              GraphQL queries and how to use fragments to encapsulate data requirements. See how single or multiple
              mutations work. Find out about powerful pagination using GraphQL and Apollo Client.</p>
          </dt>
          <dt>
            <h3>Excursions</h3>
              <p>Several excursions are planned, that will zoom in on specific topics such as improving your development
              workflow with the Redux DevTools or controlling the Apollo Client Store with mutation results and
              optimistic UI.</p>
          </dt>
        </dl>
        <div className={styles.start}>
          <Link to={`/${chapters[0].alias}/${chapters[0].subchapters[0].alias}`}>Start interactive tutorial</Link>
        </div>
      </div>
    )
  }

  private toggleSmoochButton = (visible: boolean) => {
    const id = 'smooch-tmp-style'

    if (visible) {
      const style = document.getElementById(id)!
      document.head.removeChild(style)
    } else {
      const style = document.createElement('style')
      style.id = id
      style.type = 'text/css'
      style.appendChild(document.createTextNode('#sk-holder #sk-messenger-button { display: none; }'))
      document.head.appendChild(style)
    }
  }
}
