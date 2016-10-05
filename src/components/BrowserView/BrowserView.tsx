import * as React from 'react'
import * as Relay from 'react-relay'
import Icon from '../Icon/Icon'
import AddPokemonMutation from '../../mutations/AddPokemonMutation'
import BrowserRow from '../BrowserRow/BrowserRow'

const styles: any = require('./BrowserView.module.styl')

interface Props {
  viewer: any
}

interface State {
  name: string
  url: string
}

class BrowserView extends React.Component<Props, State> {

  state = {
    name: '',
    url: '',
  }

  render() {
    return (
      <div style={{height: 280, padding: 20, overflow: 'auto'}}>
        <div className='flex' style={{color: 'rgba(0,0,0,0.25)'}}>
          <div className='ttu' style={{padding: '0 0 13px 13px', minWidth: '30%'}}>
            Pokemon-Id
          </div>
          <div className='ttu' style={{padding: '0 0 13px 13px', minWidth: '30%'}}>
            Name
          </div>
          <div className='ttu' style={{padding: '0 0 13px 13px', minWidth: '40%'}}>
            Image Url
          </div>
        </div>
        <div className='overflow-auto' style={{paddingBottom: 20}}>
          {this.props.viewer.allPokemons.edges.map((edge) => edge.node).map(
            (node) => <BrowserRow key={node.id} pokemon={node} viewerId={this.props.viewer.id}/>
          )}
          <div className={`w-100 flex relative ${styles.newRow}`}>
            <input
              className='i bg-transparent accent'
              style={{
                minWidth: '30%',
                padding: '12px',
                boxSizing: 'border-box',
              }}
              value={'Add new Pokémon (id will be generated)'}
              disabled
            />
            <input
              className='bg-transparent accent'
              placeholder='insert Pokemon name'
              style={{
                minWidth: '30%',
                padding: '12px',
                boxSizing: 'border-box',
              }}
              value={this.state.name}
              onChange={(e: any) => this.setState({name: e.target.value} as State)}
              onKeyDown={(e) => e.keyCode === 13 && this.addPokemon()}
            />
            <input
              className='bg-transparent accent'
              placeholder='insert an image url'
              style={{
                minWidth: '40%',
                padding: '12px',
                boxSizing: 'border-box',
              }}
              value={this.state.url}
              onChange={(e: any) => this.setState({url: e.target.value} as State)}
              onKeyDown={(e) => e.keyCode === 13 && this.addPokemon()}
            />
            {this.state.name && this.state.url &&
            <div className='flex items-center absolute h-100' style={{right: 10}}>
              <Icon
                onClick={this.addPokemon}
                className='pointer dim'
                width={24}
                height={24}
                src={require('../../assets/icons/check.svg')}
              />
            </div>
            }
          </div>
        </div>
      </div>
    )
  }

  private addPokemon = () => {
    analytics.track('overlay: create pokemon')
    Relay.Store.commitUpdate(
      new AddPokemonMutation({viewer: this.props.viewer, name: this.state.name, url: this.state.url}),
      {
        onSuccess: () => this.setState({name: '', url: ''}),
      }
    )
  }
}

export default Relay.createContainer(BrowserView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        allPokemons (first: 1000) {
          edges {
            node {
              id
              ${BrowserRow.getFragment('pokemon')}
            }
          }
        }
      }
    `,
  },
})
