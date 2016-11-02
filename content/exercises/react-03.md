# React Track 03 - Advanced Queries

This is the third exercise in the **React Track**! If you prefer React Native or Angular 2 over React, head over to the respective tutorial track.

## Goal

In this exercise we will have a look at advanced query features with the **goal** of showing a list of pokemon that our trainer owns.

## Introduction

Checkout the third exercise of the Pokedex React App and install the npm dependencies from your console

```sh
cd pokedex-react
git checkout exercise-03
npm install
```

## Display a list of pokemon with advanced queries

Before we start working directly on our goal to show the pokemons a trainer owns, let's take some time to get more familiar with some of the available options when using queries.

### Static Query Variables

One of the available query options are variables. A common use case for query variables is when we want to display the same type of information for two different nodes. We will see that use case shortly, but for now we are introducing a query variable to the `TrainerQuery`. This is how it looked like at the end of the last exercise:

```js
const TrainerQuery = gql`query { Trainer(name: "__NAME__") { id name } }`
```

To introduce a variable for the trainer `name`, we have to add the `$name` argument to the query parameters and assign it to the `name` argument of `Trainer`:

```js
const TrainerQuery = gql`query($name: String!) { Trainer(name: $name) { id name } }`
```

Note that we have to denote the variable type as well, `String!` signifying a required String in this case. Of course, now we also have to supply a value for that variable when we use it to wrap the `Pokedex` component:

```js
const PokedexWithData = graphql(TrainerQuery, {
  options: {
      variables: {
        name: "__NAME__"
      }
    }
  }
)(Pokedex)
```

Remember to insert your own name into the `variables` object.

### Nested Queries

Now that we saw query variables in action we can focus on displaying the pokemons of a given trainer. We will use the `PokemonPreview` component that you can find in `src/components/PokemonPreview.js` to display the individual pokemons:

```js
import React from 'react'

export default class PokemonPreview extends React.Component {

  static propTypes = {
    pokemon: React.PropTypes.object,
  }

  render () {
    return (
      <div className='dib mw4 tc black link dim ml1 mr1 mb2 bg-white pa2'>
        <div className='db'>
          <img src={this.props.pokemon.imageUrl} alt={this.props.pokemon.name} />
        </div>
        <span className='gray'>{this.props.pokemon.name}</span>
      </div>
    )
  }
}

```

All it depends on is the `pokemon` prop, that we have to inject in the `Pokedex` component. Remember the structure of the `Trainer` and the `Pokemon` types:

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

As we can see, the server stores the owned pokemons of each trainer, exactly the information that we need!
We can now add the `ownedPokemons` field to our `TrainerQuery`. Let's include the `id`, `imageUrl` and `name` in the nested selection on the owned pokemons:

```js
const TrainerQuery = gql`query($name: String!) {
  Trainer(name: $name) {
    id
    name
    ownedPokemons {
      id
      name
      imageUrl
    }
  }
}`
```

Once the query has finished, `this.props.data.Trainer` in the `Pokedex` component contains the `ownedPokemons` object that gives access to the information we selected. We can now map over the pokemons in `ownedPokemons` to include the `PokemonPreview` components in the `Pokedex` component:

```js
render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    return (
      <div className='w-100 bg-light-gray min-vh-100'>
        <div className='tc pt4'>
          Hey {this.props.data.Trainer.name}, there are {this.props.data.Trainer.ownedPokemons.length} Pokemons in your pokedex
        </div>
        <div className='flex flex-wrap items-stretch pt5 center mw7'>
          {this.props.data.Trainer.ownedPokemons.map((pokemon) =>
            <PokemonPreview key={pokemon.id} pokemon={pokemon} />
          )}
        </div>
      </div>
    )
  }
```

Note the use of `this.props.data.Trainer.ownedPokemons.length` that displays the correct amount of pokemons.


### Dynamic Query Variables

Cool, so now we can see all the pokemons we own in our pokedex. Verify that by running

```sh
npm start
```

and visiting [http://localhost:3000](http://localhost:3000). If everything working, we can now continue to implement a detailed view of a single pokemon when we click on a `PokemonPreview` component. Have a look at the `PokemonCard` component in `src/components/PokemonCard.js` that we prepared for you. It renders a pokemon passed in as a prop from its parent, the `PokemonPage` component in `src/components/PokemonPage.js`.

We already created a new route in `src/index.js` that assigns the `PokemonPage` to the path `view/:pokemonId` so we can use the path parameter `pokemonId` to query a pokemon. You now have to change the render method of `PokemonPage` so that it includes the `Link` component from `react-router` that redirects to the `view/:pokemonId` path:

```js
render () {
  return (
    <Link to={`/view/${this.props.pokemon.id}`} className='dib mw4 tc black link dim ml1 mr1 mb2 bg-white pa2'>
      <div className='db'>
        <img src={this.props.pokemon.imageUrl} alt={this.props.pokemon.name} />
      </div>
      <span className='gray'>{this.props.pokemon.name}</span>
    </Link>
  )
}
```

The `PokemonPage` component is responsible to pass down a pokemon to the `PokemonCard` component. Let's add a `PokemonQuery` to `PokemonPage` that is fetching the required pokemon object:

```js
const PokemonQuery = gql`
  query PokemonQuery($id: ID!) {
    Pokemon(id: $id) {
      id
      imageUrl
      name
    }
  }
`
```

As you can see, the query requires a query variable `id` of type `ID` that we have to supply using the query option `variables` as before. However, other than with the trainer name variable, we cannot just use a cannot value as the id in our case. For that reason, we have the possibility to access the props when creating the `variables` object. So, we can replace:

```js
export default withRouter(PokemonPage)
```

with:

```js
const PokemonPageWithQuery = graphql(PokemonQuery, {
  options: (ownProps) => ({
      variables: {
        id: ownProps.params.pokemonId
      }
    })
  }
)(withRouter(PokemonPage))

export default PokemonPageWithQuery
```

Now we can replace the placeholder content of the render method in `PokemonPage` with the `PokemonCard` component:

```js
class PokemonPage extends React.Component {

  static propTypes = {
    data: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
  }

  render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    return (
      <div>
        <PokemonCard pokemon={this.props.data.Pokemon} handleCancel={this.goBack}/>
      </div>
    )
  }

  goBack = () => {
    this.props.router.replace('/')
  }
}
```

Note that we introduced the new required `data` prop and guarded its usage again with the boolean `data.loading`.

Now let's run the app again to see if everything is working

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser and you should see a list of pokemons. Click on a pokemon preview to move over to the detailed view. Click the cancel button to return back to your pokedex.

## Recap

Nice, our pokedex starts to get some shape! We added both an overview of all our pokemons as well as a detailed view of a single pokemon. Let's go through what we saw in this exercise again:

* **Constants as query variables** helped us getting started with advanced query features
* Using GraphQL, we can easily create **nested queries**
* Combining **router parameters** and **dynamic query variables**, we were able to supply different data to the same component to quickly control what concent we want to render.
