import * as Relay from 'react-relay'

interface Props {
  viewerId: string
  pokemonId: string
}

export default class DeletePokemonMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{deletePokemon}`
  }

  getFatQuery () {
    return Relay.QL`
    fragment on DeletePokemonPayload {
      viewer
      deletedId
    }
    `
  }

  getConfigs () {
    return [{
      type: 'NODE_DELETE',
      parentName: 'viewer',
      parentID: this.props.viewerId,
      connectionName: 'pokemon',
      deletedIDFieldName: 'deletedId',
    }]
  }

  getVariables () {
    return {
      id: this.props.pokemonId,
    }
  }

  getOptimisticResponse () {
    return {
      deletedId: this.props.pokemonId,
    }
  }
}
