import * as React from 'react'
import * as Relay from 'react-relay'
import Icon from '../Icon/Icon'
import DeletePokemonMutation from '../../mutations/DeletePokemonMutation'
import UpdatePokemonMutation from '../../mutations/UpdatePokemonMutation'

const styles: any = require('./BrowserRow.module.styl')

interface Props {
  pokemon: any
  viewerId: string
}

interface State {
  id: string
  name: string
  url: string
  hover: boolean
  changesMade: boolean
}

class BrowserRow extends React.Component<Props, State> {

  state = {
    id: this.props.pokemon.id,
    name: this.props.pokemon.name,
    url: this.props.pokemon.url,
    hover: false,
    changesMade: false,
  }

  render() {
    return (
      <div
        className={`w-100 flex relative ${styles.tableRow}`}
        onMouseEnter={() => this.setState({hover: true} as State)}
        onMouseLeave={() => this.setState({hover: false} as State)}
      >
        <input
          style={{
            minWidth: '30%',
            padding: 12,
            boxSizing: 'border-box',
            borderLeft: '1px solid #E5E5E5',
          }}
          value={this.state.id}
          disabled
        />
        <input
          onBlur={this.updatePokemon}
          style={{
            minWidth: '30%',
            padding: 12,
            boxSizing: 'border-box',
          }}
          value={this.state.name}
          onChange={(e: any) => this.setState({name: e.target.value, changesMade: true} as State)}
        />
        <input
          style={{minWidth: '40%', padding: 12, boxSizing: 'border-box'}}
          value={this.state.url}
          onBlur={this.updatePokemon}
          onChange={(e: any) => this.setState({url: e.target.value, changesMade: true} as State)}
        />
        {this.state.hover &&
        <div
          className='flex items-center absolute bg-white'
          style={{padding: 10, right: 0, height: 'calc(100% - 4px)', boxSizing: 'border-box', margin: 2}}
        >
          <Icon
            onClick={this.removePokemon}
            className='pointer dim'
            width={18}
            height={18}
            src={require('../../assets/icons/delete.svg')}
          />
        </div>
        }
      </div>
    )
  }

  private removePokemon = () => {
    analytics.track('overlay: delete pokemon')
    Relay.Store.commitUpdate(
      new DeletePokemonMutation({viewerId: this.props.viewerId, pokemonId: this.props.pokemon.id})
    )
  }

  private updatePokemon = () => {
    analytics.track('overlay: update pokemon')
    if (this.state.changesMade) {
      Relay.Store.commitUpdate(
        new UpdatePokemonMutation({pokemonId: this.props.pokemon.id, name: this.state.name, url: this.state.url})
      )
    }
  }
}

export default Relay.createContainer(BrowserRow, {
  fragments: {
    pokemon: () => Relay.QL`
      fragment on Pokemon {
        id
        name
        url
      }
    `,
  },
})
