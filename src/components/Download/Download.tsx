import * as React from 'react'
import ContentEndpoint from '../ContentEndpoint/ContentEndpoint'
import { StoredState } from '../../utils/statestore'
import TrackLink from '../TrackLink/TrackLink'
import { events } from '../../utils/events'

const styles: any = require('./Download.module.styl')

interface Props {
  repository: string
  location: any
}

interface State {
  downloading: boolean
}

interface Context {
  storedState: StoredState
}

export default class Download extends React.Component<Props, State> {

  static contextTypes = {
    storedState: React.PropTypes.object.isRequired,
  }

  context: Context

  state = {
    downloading: false,
  }

  render() {
    if (!this.context.storedState.user) {
      return (
        <ContentEndpoint location={this.props.location}/>
      )
    }

    const url = `${__LAMBDA_DOWNLOAD_EXAMPLE__}?repository=${this.props.repository}&project_id=${this.context.storedState.user.projectId}&user=learnapollo&name=${encodeURIComponent(this.context.storedState.user.name)}`
    return (
      <div
        className='tc'
        id='graphql-endpoint'
        onClick={() => this.setState({ downloading: true} as State)}
      >
        <TrackLink
          event={Object.assign({}, events.DownloadExample, { label: this.props.repository })}
          href={url}
          target='_blank'
          className={`pa3 pointer ${styles.getEndpoint}`}
          download={this.props.repository}
        >
          Download Example
        </TrackLink>
        {this.state.downloading &&
        <div className='pb4 black-50'>
          Magic in progress. Download starts in a few seconds...
        </div>
        }
      </div>
    )
  }
}
