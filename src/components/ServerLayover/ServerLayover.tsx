import * as React from 'react'
import * as GraphiQL from 'graphiql'
import * as CopyToClipboard from 'react-copy-to-clipboard'
import * as Relay from 'react-relay'
import BrowserView from '../BrowserView/BrowserView'
import Icon from '../Icon/Icon'

require('graphiql/graphiql.css')

interface Props {
  endpoint: string
  close: () => void
  viewer: any
}

interface State {
  showData: boolean
}

class ServerLayover extends React.Component<Props, State> {

  state = {
    showData: true,
  }

  render() {
    const graphQLFetcher = (graphQLParams) => {
      return fetch(this.props.endpoint, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(graphQLParams),
      })
        .then(response => response.json())
    }

    return (
      <div
        className='fixed bottom-0 w-100 bg-gray-2'
        style={{
          height: this.state.showData ? 350 : 550,
          transition: 'height 0.5s ease',
          zIndex: 10,
        }}
      >
        <div className='flex justify-between bg-accent' style={{ height: 70 }}>
          <div className='flex pt2'>
            <div
              className={`
                h-100 f4 flex items-center ph3 mh2 pointer
                ${this.state.showData ? 'bg-gray-2 accent' : 'white'}
              `}
              onClick={this.showData}
            >
              Data Browser
            </div>
            <div
              className={`
                h-100 f4 flex items-center ph3 mh2 pointer
                ${!this.state.showData ? 'bg-gray-2 accent' : 'white'}
              `}
              onClick={this.showGraphiQL}
            >
              GraphiQL
            </div>
          </div>
          <div className='flex items-center p3'>
            <div className='o-30' style={{marginRight: 12}}>API Endpoint</div>
            <div className='flex items-center'>
              <CopyToClipboard
                text={this.props.endpoint}
                onCopy={() => analytics.track('overlay: copied endpoint')}
              >
                <Icon src={require('../../assets/icons/copy.svg')}
                      className='dim'
                      style={{
                    padding: '6px',
                    background: 'rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                  }}
                />
              </CopyToClipboard>
              <div
                className='o-50'
                style={{background: 'rgba(0,0,0,0.05)', padding: '6px 12px'}}
              >
                {this.props.endpoint}
              </div>
            </div>
            <div
              className='f2 mh3 pointer'
              onClick={this.props.close}
            >
              <Icon
                src={require('../../assets/icons/close.svg')}
                color='#fff'
                width={19}
                height={19}
              />
            </div>
          </div>
        </div>
        {this.state.showData &&
        <BrowserView viewer={this.props.viewer}/>
        }
        {!this.state.showData &&
        <div style={{height: 480}}>
          <GraphiQL
            fetcher={graphQLFetcher}
            variables={''}
          />
        </div>
        }
      </div>
    )
  }

  private showData = () => {
    analytics.track('overlay: show data')
    this.setState({ showData: true } as State)
  }

  private showGraphiQL = () => {
    analytics.track('overlay: show graphiql')
    this.setState({ showData: false } as State)
  }
}

const LayoverContainer = Relay.createContainer(ServerLayover, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        ${BrowserView.getFragment('viewer')}
      }
    `,
  },
})

interface RendererProps {
  endpoint: string
  close: () => void
}

export default class LayoverRenderer extends React.Component<RendererProps, {}> {

  constructor(props) {
    super(props)

    Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer(this.props.endpoint))
  }

  render() {
    return (
      <Relay.Renderer
        Container={LayoverContainer}
        environment={Relay.Store}
        queryConfig={{
          name: '',
          queries: {viewer: () => Relay.QL`query { viewer }`},
          params: {endpoint: this.props.endpoint, close: this.props.close},
        }}
      />
    )
  }
}
