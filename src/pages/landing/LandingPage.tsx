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
          <h2>A comprehensive introduction to Apollo</h2>
        </header>
        <dl className={styles.contents}>
          <dt>
            <h3>Overview</h3>
            <p>Get a broad overview of the goals and prerequisites of this introduction to Apollo and get to know the Pokedex app we will build together.</p>
          </dt>
          <dt>
            <h3>Introduction to Apollo</h3>
            <p>Learn the basics of Apollo and set up your environment for the following chapters. As Apollo is a GraphQL client, this introduction focuses on the client side. You can use the included GraphQL backend to get the most out of this introduction and follow along in several practical steps that will lead to a fully functional Pokedex app!</p>
          </dt>
          <dt>
            <h3>Queries</h3>
            <p><b>Queries</b> are a central part of Apollo as they are used to fetch data from the GraphQL server.
            Whenever we want to declare a data dependency in one of our React components, we have to wrap it with a <b>container</b>.
            Usually, you are building queries by combining <b>fragments</b> and using <b>query variables</b> to add additional flexibility.

            Combine these parts and get familiar with the Pokedex app by preparing things for the following chapters.</p>
          </dt>
        </dl>
        <div className={styles.start}>
          <Link to={`/${chapters[0].alias}/${chapters[0].subchapters[0].alias}`}>Start interactive tutorial</Link>
        </div>
      </div>
    )
  }
}
