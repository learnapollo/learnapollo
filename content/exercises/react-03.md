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

## Advanced Queries

Before we start working directly on our goal to show the pokemons a trainer owns, let's take some time to get more familiar with some of the available options when using queries.

### Query Variables

One of the available query options are variables. A common use case for query variables is when we want to display the same type of information for two different nodes. We will see that use case in a subsequent exercise, but for now we are introducing a query variable to the `TrainerQuery`. This is how it looked like at the end of the last exercise:

```js
const TrainerQuery = gql`query { Trainer(name: "<your name>") { id name } }`
```

To introduce a variable for the trainer `name`, we have to add the `$name` argument to the query parameters and assign it to the `name` argument of `Trainer`:

```js
const TrainerQuery = gql`query($name: String!) { Trainer(name: $name) { id name } }`
```

Note that we have to denote the variable type as well, `String!` signifying a required String in this case. Of course, now we also have to supply a value for that variable once we use it to wrap the `Pokedex` component:

```js
const PokedexWithData = graphql(TrainerQuery, {
  options: {
      variables: {
        name: "<your name>"
      }
    }
  }
)(withRouter(Pokedex))
```

> Note: later we will see a way how to control query variables from the parent via props.

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


## Show a list of Pokemons

If you followed along with the changes run the app to see if everything is working

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser and you should see a list of pokemons.

## Recap

Nice, our pokedex starts to get some shape! Let's go through what we saw in this exercise:

* With **query variables** we got a sneak peek into more advanced query features
* Using GraphQL, we can easily create **nested queries**
