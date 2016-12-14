import * as React from 'react'
import * as CopyToClipboard from 'react-copy-to-clipboard'
import Loading from '../Loading/Loading'
import {StoredState} from '../../utils/statestore'
import Markdown from '../Markdown/Markdown'
import TrackLink from '../TrackLink/TrackLink'
import Icon from '../Icon/Icon'
import {Parser} from 'commonmark'

const styles: any = require('./ContentEndpoint.module.styl')

interface Props {
  location: any
}

interface State {
  allowStar: boolean
}

interface Context {
  storedState: StoredState
  updateStoredState: (keyPath: string[], value: any) => void
}

const parser = new Parser()
const ast = parser.parse(require('../../../content/introduction/get-started-bottom.md'))

export default class ContentEndpoint extends React.Component<Props, State> {

  static contextTypes = {
    storedState: React.PropTypes.object.isRequired,
    updateStoredState: React.PropTypes.func.isRequired,
  }

  state = {
    allowStar: true,
  }

  context: Context

  render() {
    const redirectUrl = `${window.location.origin}${window.location.pathname}#graphql-endpoint`
    const scope = this.state.allowStar ? 'user:email,public_repo' : 'user:email'
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${__GITHUB_OAUTH_CLIENT_ID__}&scope=${scope}&redirect_uri=${redirectUrl}` // tslint:disable-line

    if (this.props.location.query.code) {
      return (
        <Loading />
      )
    }

    const endpoint = (
      <div className='mb5'>
        <TrackLink
          href={githubUrl}
          className={`pa3 pointer ${styles.getEndpoint}`}
          eventMessage='open github auth'
        >
          Get GraphQL Endpoint
        </TrackLink>
        <div
          onClick={() => this.setState({ allowStar: !this.state.allowStar } as State)}
          className='flex items-center justify-center pointer'
        >
          <input
            type='checkbox'
            checked={this.state.allowStar}
            onChange={() => null}
          />
          <span className='black-50 pl2 f5'>
            Star Learn Apollo on Github
          </span>
        </div>
      </div>
    )

    if (this.context.storedState.skippedAuth) {
      return (
        <div id='graphql-endpoint'>
          <div className='tc'>
            {endpoint}
          </div>
          <Markdown ast={ast} location={this.props.location} sourceName='getting-started-bottom' />
        </div>
      )
    }

    if (this.context.storedState.user && this.context.storedState.user.projectId) {
      return (
        <div className='flex flex-column' id='graphql-endpoint'>
          Congrats, this is your endpoint:
          <div className={`pa3 flex ${styles.showEndpoint}`}>
            <span>
            {`https://api.graph.cool/simple/v1/${this.context.storedState.user.projectId}`}
            </span>
            <CopyToClipboard
              className='ml3'
              text={`https://api.graph.cool/simple/v1/${this.context.storedState.user.projectId}`}
              onCopy={() => analytics.track('overlay: copied endpoint')}
            >
              <Icon
                src={require('../../assets/icons/copy.svg')}
                className='dim'
                style={{
                  padding: '6px',
                  background: 'rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
              />
            </CopyToClipboard>
          </div>
          <Markdown ast={ast} location={this.props.location} sourceName='getting-started-bottom' />
        </div>
      )
    }

    return (
      <div className='tc' id='graphql-endpoint'>
        {endpoint}
        <div className='db mb4 pointer accent f6' onClick={this.skipEndpoint}>
          Read on without GraphQL endpoint (non-interactive)
        </div>
      </div>
    )
  }

  private skipEndpoint = () => {
    analytics.track('skip endpoint')
    this.context.updateStoredState(['skippedAuth'], true)
  }
}
