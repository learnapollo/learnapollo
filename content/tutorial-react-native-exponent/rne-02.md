# Tutorial 02 - Basic Queries

This is the second exercise in the **React Native Exponent Track** of this Apollo Client Tutorial!

## Goal

The **goal** of this exercise is to display information on your very own trainer node.
With will learn how to use Apollo Client to send queries that fetch data from a GraphQL server.
Furthermore, we will explore how to use the Redux DevTools in combination with Apollo.

## Introduction

Move to the second exercise of the Pokedex React App and install the dependencies from your console

```sh
cd pokedex-react-native/exercise-02-initial
yarn install
```

As  can see in the GraphiQL, the schema exposed by our GraphQL server includes the following models

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

We can manage pokemon trainers that are related to multiple pokemons and are identified by both an id and a name.
A pokemon has a url and a name and is related to its trainer.

Let's now build a GraphQL query together to get the information of your trainer node stored on the server and
change the message displayed in `./screens/HomeScreen/components/Title.js`.

## Displaying information

Queries offer a flexible way to state data requirements. With Apollo Client, we first define queries and then
inject their response to the inner component.
As far as the inner component is concerned, the data is coming from *somewhere*, which means we have a
good decoupling between data source and data consumer.

### Building Queries

The GraphQL server for the Pokedex App is configured so that we can identify trainers by their name. To query the
information of a trainer given his name, you can use the following query:

```
query {
  Trainer(name: "__NAME__") {
    id
    name
  }
}
```

With Apollo, we need to denote queries like this by using the `gql` tag contained in the `graphql-tag` package.

```sh
yarn add graphql-tag
```

```js
const TrainerQuery = gql`query {
  Trainer(name: "__NAME__") {
    id
    name
  }
}`
```

If you signed up with GitHub, we already inserted the name you signed up with. But how do we use this query in our
Pokedex component? We can use `graphql` exposed from the `react-apollo` package to inject query results to
React components via the `data` prop.

```js
const PokedexWithData = graphql(TrainerQuery)(Pokedex)
```

### Using query results in React components

Wrapping components like this with `graphql` injects a new `data` object to the props of the inner components.
We can stress this by updating the `propTypes` of the `Pokedex` component:

```js
static propTypes = {
  data: React.PropTypes.object.isRequired,
}
```

The `data` object provides several things, in particular

* `data.loading`
  * `true` : signifies whether a query is currently being sent to the server and we are waiting for the query responseonce
  * `false`, we know that the query response arrived and all the fields from the query are available via `data`.

* `data.error` is false or a truthy object with more details inside. It can be a server error or a network error
* `data.***` contains the `***` data
  * in our case `data.Trainer` contains a `Trainer` object with the `id` and `name` properties

So let's now change the message to display the name of the trainer once `loading` is `false` and `error` is `false`:

```js
  // ...
  render() {
    if (this.props.data.error) {
      return (
        <BaseText
          fontFace="source-sans"
          style={{fontSize: 14, color: 'red'}}
        >
          Sadly, the requested Trainer does not exist yet.
        </BaseText>
      );
    }

    if (this.props.data.loading) {
      return <ActivityIndicator />
    }

    return (
      <BaseText
        fontFace="source-sans"
        style={{fontSize: 14}}
      >
        Hey {this.props.data.Trainer.name}, there are 0 Pokemons in your pokedex
      </BaseText>
    )
  }
```

If you try to execute this, you will have the following error `Cannot load property error of undefined`.

This is normal since the Title component is not connected to Apollo Client.

### Putting it all together

Now put the previous steps together and modify our Pokedex component in `./screens/HomeScreen/components/Title.js`.

First, include the new dependencies:

```js
// add the required dependencies
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
```

Also include the `data` prop to the `propTypes` and use `data.error, `data.loading` and `data.Trainer` as discussed
above in your render function.

In the same file, define the `TrainerQuery` (insert your name!) as discussed above.
Then connect it to our `Title` component and finally export the new component

```js
export const PokedexWithData = graphql(TrainerQuery)(Title)
```

In `./screens/HomeScreen/index.js`, replace use and import of Title component by TitleWithData;

## Hello, Trainer!

To confirm your environment is all correctly setup, start the app now from XDE.

## Excursion: Redux DevTools

[Coming soon](/exercises/excursion-01).

## Recap

Nice, you executed your first GraphQL query with Apollo Client and used it to display your trainer name.
In this exercise we learned a lot! Let's recap that:

* The shape of valid queries depend on the **schema from the GraphQL server**.
* Before executing them, we have to **define queries using the `gql` tag** from the `graphql-tag` package.
* **Wrapping a component with `graphql`** from `react-apollo` using a query injects the `data` prop to the inner component
* The **`data` prop contains the fields of the query, if `data.error` is false,  once `data.loading` is `false`**.
  Before that, we can render a loader state by using `data.loading`and react native ActivityIndicator
