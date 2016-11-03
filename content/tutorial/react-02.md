# React Track 02 - Basic Queries

This is the second exercise in the **React Track** of this Apollo Client Tutorial! If you prefer React Native or Angular 2 over React, head over to the respective tutorial track.

## Goal

The **goal** of this exercise is to display information on your very own trainer node. With will learn how to use the Apollo Client to send queries that fetch data from a GraphQL server. Furthermore, we will explore how to use the Redux DevTools in combination with Apollo.

## Introduction

Checkout the second exercise of the Pokedex React App and install the npm dependencies from your console

```sh
cd pokedex-react
git checkout exercise-02
npm install
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
  imageUrl: String!
  name: String!
  trainer: Trainer
}
```

We can manage pokemon trainers that are related to multiple pokemons and are identified by both an id and a name. A pokemon has a imageUrl and a name and is related to its trainer.

Let's now build a GraphQL query together to get the information of your trainer node stored on the server and change the message displayed in `src/components/Pokedex.js`.

## Displaying information of your trainer

Queries offer a flexible way to state data requirements. With Apollo Client, we first define queries and then inject their response to the inner component. As far as the inner component is concerned, the data is coming from *somewhere*, which means we have a good decoupling between data source and data consumer.

### Building Queries

The GraphQL server for the Pokedex App is configured so that we can identify trainers by their name. To query the information of a trainer, you can use the following query:

```
query {
  Trainer(name: "__NAME__") {
    id
    name
  }
}
```

With Apollo, we need to denote queries like this by using the `gql` tag contained in the `graphql-tag` package.

```js
const TrainerQuery = gql`query { Trainer(name: "__NAME__") { id name } }`
```

Insert the name you signed up with into the query. For example, the trainer named Ash, would need this `TrainerQuery`:

```js
const TrainerQuery = gql`query { Trainer(name: "Ash") { id name } }`
```

But how do we use this query in our Pokedex component? We can use `graphql` exposed from the `react-apollo` package to inject query results to React components via the `data` prop.

```js
const PokedexWithData = graphql(TrainerQuery)(Pokedex)
```

### Using query results in React components

Wrapping components like this with `graphql` injects a new `data` object to the props of the inner components. We can stress this by updating the `propTypes` of the `Pokedex` component:

```js
static propTypes = {
  data: React.PropTypes.object.isRequired,
}
```

The `data` object provides several things, in particular

* `data.loading` signifies whether a query is currently being sent to the server and we are waiting for the query response
* once `loading` is `false`, we know that the query response arrived and all the fields from the query are available via `data`. In our case, this is a `Trainer` object with the `id` and `name` properties, available at `data.Trainer`

So let's now change the message to display the name of the trainer once `loading` is `false`:

```js
render () {
  if (this.props.data.loading) {
    return (<div>Loading</div>)
  }

  return (
    <div className='w-100 bg-light-gray min-vh-100'>
      <div className='tc pt4'>
        Hey {this.props.data.Trainer.name}, there are 0 Pokemons in your pokedex
      </div>
    </div>
  )
}
```

### Putting it all together

Now let's put the previous steps together and modify our Pokedex component in `src/components/Pokedex.js`. First, we need to include the new dependencies:

```js
// add the required dependencies
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
```

We also include the `data` prop to the `propTypes` and use `data.loading` and `data.Trainer` as discussed above:

```js
// replace 'export default class' by 'class'
class Pokedex extends React.Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
  }

  render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    return (
      <div className='w-100 bg-light-gray min-vh-100'>
        <div className='tc pt4'>
          Hey {this.props.data.Trainer.name}, there are 0 Pokemons in your pokedex
        </div>
      </div>
    )
  }
}
```

Finally, we are defining the `TrainerQuery` (insert your name!), connect it to our `Pokedex` component and finally export the new component:

```js
const TrainerQuery = gql`query {
  Trainer(name: "__NAME__") {
     name
   }
 }`

const PokedexWithData = graphql(TrainerQuery)(Pokedex)

export default PokedexWithData
```

## Hello, Trainer!

If you finished all the changes to `src/components/Pokedex.js` successfully, go ahead and run the app again

```sh
npm start
```

After the app starts, open [http://localhost:3000](http://localhost:3000) in your browser and you should see the updated greeting.

## Excursion: Redux DevTools

Coming soon.

## Recap

Nice, you executed your first GraphQL query with the Apollo Client and used it to display your trainer name. In this exercise we learned a lot! Let's recap that:

* The shape of valid queries depend on the **schema from the GraphQL server**.
* Before executing them, we have to **define queries using the `gql` tag** from the `graphql-tag` package.
* **Wrapping a component with `graphql`** from `react-apollo` using a query injects the `data` prop to the inner component
* The **`data` prop contains the fields of the query, once `data.loading` is `false`**. Before that, we can render a loading state by using `data.loading`.
