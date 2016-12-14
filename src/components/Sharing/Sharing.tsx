import * as React from 'react'
import {StoredState} from '../../utils/statestore'

const styles: any = require('./Sharing.module.styl')

interface Props {
}

interface State {
  slackSent: boolean
  email: string
}

interface Context {
  storedState: StoredState
}

export default class Sharing extends React.Component<Props, State> {

  static contextTypes = {
    storedState: React.PropTypes.object.isRequired,
  }

  context: Context

  constructor(props: Props, context: Context) {
    super(props)

    this.state = {
      slackSent: false,
      email: context.storedState.user ? context.storedState.user.email : '',
    }
  }

  render() {
    const shareTitle = 'I just learned how to develop apps with Apollo and GraphQL'
    const shareUrl = encodeURIComponent(window.location.origin)

    return (
      <div className='db'>
        <p
          style={{
            paddingTop: '0.92rem',
          }}
        >
          We hope you enjoyed learning Apollo! We put a lot of work into these resources and hope it helps as many developers as possible getting started with Apollo.
          You can help us by sharing it.
        </p>
        <div
          className='flex justify-center'
          style={{
            paddingBottom: '2rem',
            marginBottom: '2rem',
          }}
        >
          <a
            href={`http://www.twitter.com/share?url=${shareUrl}&text=${shareTitle}`}
            target='_blank'
            className={styles.button}
            style={{background: '#3cf'}}
          >
            Share on Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&t=${shareTitle}`}
            target='_blank'
            className={`ml2 ${styles.button}`}
            style={{background: '#3b5998'}}
          >
            Share on Facebook
          </a>
        </div>
        <h1
          className='accent'
          style={{
            fontWeight: 300,
            paddingTop: 30,
            paddingBottom: '0.92rem',
            marginTop: 'calc(2.3rem - 30px)',
            marginBottom: '1.6rem',
            borderBottom: '1px solid rgba(0, 0, 0, 0.0980392)',
          }}
        >
          Setup a GraphQL backend for your next project
        </h1>
        <p>
          If you liked working with the included server and console right in your browser, check out <a href='http://graph.cool'>Graphcool</a>. It enables you to setup a GraphQL backend in minutes so you can focus on building awesome applications.
        </p>
        <div className='w-100'>
          <img src={'http://i.imgur.com/J0zGy6N.png'} />
        </div>
        <p>
          If you need further help with GraphQL, Apollo or Graphcool or have any other questions, come and join our Slack.
        </p>
        {this.state.slackSent &&
        <strong>
          Gotcha! Please check your emails and look for the #learnapollo channel after joining Slack.
        </strong>
        }
        {!this.state.slackSent &&
        <div
          className='flex justify-center'
          style={{
            marginBottom: '2rem',
          }}
        >
          <input
            type='text'
            value={this.state.email}
            placeholder='you@gmail.com'
            className={styles.mail}
            onKeyDown={this.submitOnEnter}
            onChange={(e: any) => this.setState({ email: e.target.value } as State)}
          />
          <button className={styles.slackButton} onClick={this.submit}>
            <img src={require('../../assets/images/slack_logo.png')}/>
            Join Slack
          </button>
        </div>
        }
      </div>
    )
  }

  private submitOnEnter = (e: React.KeyboardEvent<any>) => {
    if (e.keyCode === 13) {
      this.submit()
    }
  }

  private submit = () => {
    const { email } = this.state

    analytics.track('join slack', { email })

    fetch('https://slack.graph.cool/invite', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(() => {
        this.setState({slackSent: true} as State)
      })
  }
}
