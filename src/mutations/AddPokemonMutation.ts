import * as Relay from 'react-relay'

interface Props {
  viewer: any
  url: string
  name: string
}

export default class AddPokemonMutation extends Relay.Mutation<Props, {}> {

  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `,
  }

  getMutation() {
    return Relay.QL`mutation{createPokemon}`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreatePokemonPayload {
        pokemon
        edge
        viewer {
          allPokemons
        }
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewer.id,
      connectionName: 'allPokemons',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables() {
    return {
      name: this.props.name,
      url: this.props.url,
    }
  }

  getOptimisticResponse() {
    return {
      edge: {
        node: {
          name: this.props.name,
          url: this.props.url,
        },
      },
      viewer: {
        id: this.props.viewer.id,
      },
    }
  }
}
