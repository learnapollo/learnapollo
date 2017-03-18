# Basic Queries - React-Native Tutorial (2/6)


This is the second exercise in the **React Native Track** of this Apollo Client Tutorial!

<iframe width="560" height="315" src="https://www.youtube.com/embed/Mds3w8ebudM" frameborder="0" allowfullscreen></iframe>

## Goal

The **goal** of this exercise is to query information on your very own trainer node. We will use it to add a personal touch to the greeting to our pokedex:

![](../images/react-native-exercise-02-pokedex.png)

We will learn how to query information from a GraphQL server with Apollo Client.

## Introduction

Move to the second exercise and install the dependencies from your console:

```sh
cd pokedex-react-native/exercise-02
yarn install # or npm install
```

As you saw before, the schema exposed by our GraphQL server includes the following models

```graphql
type Trainer {
  id: String!
  name: String!
  ownedPokemons: [Pokemon]
}

type Pokemon {
  id: String!
  url: String!
  name: String!
  trainer: Trainer
}
```

We can manage pokemon trainers that are related to multiple pokemons and are identified by both an id and a name. A pokemon has a url and a name and is related to its trainer.

Let's now build a GraphQL query together to get the information of your trainer node stored on the server and change the message displayed in `components/Pokedex.js`.

## Displaying information of your trainer

Queries offer a flexible way to state data requirements. With Apollo Client, we first define queries and then inject their response to the inner component. As far as the inner component is concerned, the data could be coming from *anywhere*, which means we have a good decoupling between data source and data consumer.

### Building Queries

The GraphQL server for the Pokedex App is configured so that we can identify trainers by their name. To query the information of a trainer given his name, you can use the following query:

```
query TrainerQuery {
  Trainer(name: "__NAME__") {
    id
    name
  }
}
```

With Apollo, we need to denote queries like this by using the `gql` tag contained in the `graphql-tag` package.

```js
const TrainerQuery = gql`
  query TrainerQuery {
    Trainer(name: "__NAME__") {
      id
      name
    }
  }
`
```

If you signed up with GitHub, we already inserted the name you signed up with. But how do we use this query in our Pokedex component? We can use `graphql` exposed from the `react-apollo` package to inject query results to React components via the `data` prop.

```js
const PokedexWithData = graphql(TrainerQuery)(Pokedex)
```

### Using query results in React components

Wrapping components like this with `graphql` injects a new `data` object to the props of the inner components. We can stress this by updating the `propTypes` of the `Pokedex` component:

```js
static propTypes = {
  data: React.PropTypes.shape({
    loading: React.PropTypes.bool,
    error: React.PropTypes.object,
    Trainer: React.PropTypes.object,
  }).isRequired,
}
```

The `data` object provides several things, in particular

* `data.loading` signifies whether a query is currently being sent to the server and we are waiting for the query response
* once `loading` is `false`, we know that the query response arrived and all the fields from the query are available via `data`. In our case, this is a `Trainer` object with the `id` and `name` properties, available at `data.Trainer`
* If something went wrong with the query and errors are returned, `data.error` will contain detailed information.

So let's now change the message to display the name of the trainer once `loading` is `false` and no error occurred in the `render` method of `Pokedex`:

```js
render () {
  if (this.props.data.error) {
    console.log(this.props.data.error)
    return (<CustomText style={{marginTop: 64}}>An unexpected error occurred</CustomText>)
  }

  if (this.props.data.loading || !this.props.data.Trainer) {
    return (<CustomText style={{marginTop: 64}}>Loading</CustomText>)
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
      <CustomText
        style={{
          marginTop: 64,
          padding: 16,
          fontSize: 24,
          textAlign: 'center'
        }}
      >
        Hey {this.props.data.Trainer.name}!
      </CustomText>
      <CustomText
        style={{
          padding: 16,
          paddingTop: 0,
          fontSize: 18,
          textAlign: 'center'
        }}
      >
        There are 0 Pokemons in your pokedex
      </CustomText>
    </View>
  )
}
```

> Note: We need the extra `!this.props.data.Trainer` because of a bug in Apollo.

### Putting it all together

Now let's put the previous steps together and modify our Pokedex component in `components/Pokedex.js`. First, we need to include the new dependencies:

```js@components/Pokedex.js
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
```

We also include the `data` prop to the `propTypes` and use `data.loading` and `data.Trainer` as discussed above:

```js@components/Pokedex.js
class Pokedex extends React.Component {
  static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool,
      error: React.PropTypes.object,
      Trainer: React.PropTypes.object,
    }).isRequired,
  }

  render () {
    if (this.props.data.error) {
      console.log(this.props.data.error)
      return (<CustomText style={{marginTop: 64}}>An unexpected error occurred</CustomText>)
    }

    if (this.props.data.loading || !this.props.data.Trainer) {
      return (<CustomText style={{marginTop: 64}}>Loading</CustomText>)
    }

    return (
      <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
        <CustomText
          style={{
            marginTop: 64,
            padding: 16,
            fontSize: 24,
            textAlign: 'center'
          }}
        >
          Hey {this.props.data.Trainer.name}!
        </CustomText>
        <CustomText
          style={{
            padding: 16,
            paddingTop: 0,
            fontSize: 18,
            textAlign: 'center'
          }}
        >
          There are 0 Pokemons in your pokedex
        </CustomText>
      </View>
    )
  }
}
```

Finally, we are defining the `TrainerQuery` (insert your name!), connect it to our `Pokedex` component and finally export the new component:

```js@components/Pokedex.js
const TrainerQuery = gql`
  query TrainerQuery {
    Trainer(name: "__NAME__") {
       name
    }
  }
`

const PokedexWithData = graphql(TrainerQuery)(Pokedex)

export default PokedexWithData
```

## Hello, Trainer!

If you finished all the changes to `components/Pokedex.js` successfully, start your development server using:

```sh
yarn start
```
You should see the updated greeting.

## Excursion: Redux DevTools

[Coming soon](/excursions/excursion-01).

## Recap

Nice, you executed your first GraphQL query with Apollo Client and used it to display your trainer name. In this exercise we learned a lot! Let's recap that:

* The shape of valid queries depend on the **schema from the GraphQL server**.
* Before executing them, we have to **define queries using the `gql` tag** from the `graphql-tag` package.
* **Wrapping a component with `graphql`** from `react-apollo` using a query injects the `data` prop to the inner component
* The **`data` prop contains the fields of the query, once `data.loading` is `false`**. Before that, we can render a loading state by using `data.loading`.
App
