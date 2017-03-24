# Basic Mutations - React Tutorial (5/7)

Welcome to the 5th exercise in the **React Track** of this Apollo Client Tutorial!

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZXvBmA-hKwc?list=PLn2e1F9Rfr6neWxkWtlTAwshh07-m1p5I" frameborder="0" allowfullscreen></iframe>

## Goal

In this exercise we have the **goal** of adding the possibility to create new pokemons:

![](../images/react-exercise-05-addpokemon.png)

A button in the pokedex will redirect to the new component. After creating the pokemon it will appear in our pokedex:

![](../images/react-exercise-05-pokedex.png)

Data changes in GraphQL are handled by mutations, so it's time for us to learn about them.

## Introduction

Move to the 5th exercise, install the dependencies and run the Pokedex React App from your console

```sh
cd pokedex-react/exercise-05
yarn install # or npm install
yarn start # or npm start
```

## Adding new pokemons to the pokemon list

Currently we have a cool, shiny list of pokemons that are assigned to our trainer node. However, pokemon trainers are supposed to catch new pokemons once in a while, so we should account for that in our pokedex.

### Adding `AddPokemonPreview` to the `Pokedex`

We are going to add the new component `AddPokemonPreview` we prepared for you alongside the pokemons in our `Pokedex` component. You can find it in `src/components/AddPokemonPreview.js`.

As we need to know which trainer gets assigned the new pokemon, `AddPokemonPreview` has a required `trainerId` prop. Head over to the `Pokedex` component and add the `AddPokemonPreview` component right above the `PokemonPreview` components:

```js@src/components/Pokedex.js
return (
  <div className='w-100 bg-light-gray min-vh-100'>
    <Title className='tc pa5'>
      Hey {this.props.data.Trainer.name}, there are {this.props.data.Trainer.ownedPokemons.length} Pokemons in your pokedex
    </Title>
    <div className='flex flex-wrap justify-center center w-75'>
      <AddPokemonPreview trainerId={this.props.data.Trainer.id} />
      {this.props.data.Trainer.ownedPokemons.map((pokemon) =>
        <PokemonPreview key={pokemon.id} pokemon={pokemon} />
      )}
    </div>
  </div>
)
```

Note that we require the trainer id now but didn't need it before, so we should add it to our `TrainerQuery` in the `Pokedex` component as well:

```js@src/components/Pokedex.js
const TrainerQuery = gql`
  query TrainerQuery($name: String!) {
    Trainer(name: $name) {
      id
      name
      ownedPokemons {
        id
        name
        url
      }
    }
  }
`
```

### Redirecting to `AddPokemonCard`

`AddPokemonCard` is another new component we prepared that can be used to actually add a new pokemon and is found in `src/components/AddPokemonCard.js`.

Similar to how `PokemonPreview` and `PokemonCard` work together, clicking on `AddPokemonPreview` should switch over to the `AddPokemonCard`. We already prepared a new route in `src/index.js` for you:

```js
<Route path='/create/:trainerId' component={AddPokemonCard} />
```

So all you have to do now is to use the `Link` component from `react-router` in `AddPokemonPreview` and redirect to the `/create/:trainerId` path:

```js@src/AddPokemonPreview.js
import React from 'react'
import { Link } from 'react-router'

export default class AddPokemonPreview extends React.Component {

  static propTypes = {
    trainerId: React.PropTypes.string.isRequired,
  }

  render () {
    return (
      <Link
        to={`/create/${this.props.trainerId}`}
        style={{ minWidth: 200 }}
        className='link dim mw4 ma2 ba b--dashed bw3 b--silver flex justify-center items-center'
      >
        <div className='silver tc v-mid fw4 f1'>+</div>
      </Link>
    )
  }
}
```

### Adding the createPokemon mutation to `AddPokemonCard`

Right now, the `AddPokemonCard` doesn't do too much. As we want to create a new pokemon node at the server, now is the time to think about the right mutation for this. Let's first think about the data that is needed for creating a new pokemon. Of course, we need the name and the image URL of the new pokemon. Additionally we also need the trainer id to relate the pokemon with the trainer. The mutation we need to use is called `createPokemon`. Putting this all together leaves us with the following mutation:

```js@src/components/AddPokemonCard.js
const createPokemonMutation = gql`
  mutation createPokemon($name: String!, $url: String!, $trainerId: ID) {
    createPokemon(name: $name, url: $url, trainerId: $trainerId) {
      trainer {
        id
        ownedPokemons {
          id
        }
      }
    }
  }
`
```

Note that as we discussed above, the mutation requires the variables `$name`, `$url` and `$trainerId`. Instead of only using `export default withRouter(AddPokemonCard)` we can inject the mutation similar to how we inject queries to `AddPokemonCard`:

```js@src/components/AddPokemonCard.js
const AddPokemonCardWithMutation = graphql(createPokemonMutation)(withRouter(AddPokemonCard))

export default AddPokemonCardWithMutation
```

But wait, how do we supply the needed variables to the mutation? Let's find out!

### Using mutations in components

Other than with queries, injecting mutations doesn't add the query result but the mutation itself as a function. Inside the wrapped component, we can access the mutation via `this.props.mutate`, which is a function that accepts the mutation variables as parameters. So let's first add the new required prop `mutate` to our `AddPokemonCard` component:

```js@src/components/AddPokemonCard.js
static propTypes = {
  router: React.PropTypes.object.isRequired,
  mutate: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,
}
```

Now we can call the `createPokemon` mutations by using `mutate` in `handleSave`:

```js@src/components/AddPokemonCard.js
handleSave = () => {
  const {name, url} = this.state
  const trainerId = this.props.params.trainerId
  this.props.mutate({variables: {name, url, trainerId}})
    .then(() => {
      this.props.router.replace('/')
    })
}
```

Note how we provide the variables using the `variables` object. As you can see, the mutation returns a promise, so we can chain another function by using `then` to return back to the pokemon list.

Check if you got everthing right by opening [http://localhost:3000](http://localhost:3000) in your browser and click the plus button. Add the pokemon name and image URL and click the save button. Weird, the pokemon is not displayed right away, only after refreshing the page.


## Data Normalization and the Apollo store

To fix this, we have to help Apollo Client out a bit. Unlike Relay, Apollo is not opinionated about if or how objects in query and mutation responses are identified. In our case, all nodes have an `id` field. We can tell Apollo that nodes are identified by this when setting up the `client` in `src/index.js` like this:

```js@src/index.js
const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__'}),
  dataIdFromObject: o => o.id
})
```

Note that we added the `dataIdFromObject` function to express this relation. Here, we map an object to its id field. How you handle data normalization with `dataIdFromObject` depends on your GraphQL server and schema. You can find out more in the excursion about [data normalization and managing Apollo store](/excursions/excursion-02).

## Recap

Now that you got to use mutations you already know a lot about Apollo Client, good job! Let's review what we saw in this exercise:

* **Mutations** are used to change data on the server
* Calling mutations returns a **promise that can be used to react on mutation results**
* **Wrapping a component with `graphql`** from `react-apollo` using a mutation injects the `mutate` prop to the inner component
* Other than with queries, **mutation variables can be assigned in the inner component** making it easy to use the components state as variable inputs
