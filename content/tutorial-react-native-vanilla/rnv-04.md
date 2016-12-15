# Tutorial 04 - Fragments

Welcome to the 4th exercise in the **React Native Vanilla Track** of this Apollo Client Tutorial!

## Goal

The **goal** of this exercise is to add some information to the pokemon detail view about the pokemon's trainer:

![](../images/rnv-exercise-04-pokemonpage.png)

We will use fragments and learn how they can be used to define data requirements that are co-located with the component requiring that data.

## Introduction

Change to the 4th exercise and install the dependencies from your console:

```sh
cd pokedex-react/exercise-04
yarn install # or npm install
```

## Adding information to the pokemon page

Before we add additional content to our components, let's take a step back. Right now, `PokemonPage` defines a `PokemonQuery` that fetches the pokemon needed to render the `PokemonCard` component. This results in a few disadvantages when we want to make changes later:

* if the data requirements of the `PokemonCard` component change, we have to go back to the `PokemonPage` and add additional fields to the `PokemonQuery`
* if we want to include `PokemonCard` in a another component, we will have to duplicate the `PokemonQuery`, resulting in possible errors when we have to change the query later and forget to update all places it's defined

Therefore it would be great to let the `PokemonCard` component handle the declaration of its own data requirements. Then we could refer to this in the `PokemonPage` component to make sure that we included all required data in the `PokemonQuery`. This is exactly the way fragments work.

### Defining a pokemon fragment in `PokemonCard`

We can make use of the package `graphql-anywhere` to define fragments. Let's define the `PokemonCardPokemon` fragment in `src/components/PokemonCard.js` just after the imports:

```js
import React from 'react'
import { propType } from 'graphql-anywhere'
import gql from 'graphql-tag'

import { View, TextInput, Image } from 'react-native'

export const pokemonCardFragments = {
  pokemon: gql`
    fragment PokemonCardPokemon on Pokemon {
      id
      url
      name
    }
  `
}
```

The fragment is called `PokemonCardPokemon`, because it is defined for the `PokemonCard` component and is a fragment for a `Pokemon`. Using this naming convention consistently can be helpful when using the fragment elsewhere.

We can now replace the `pokemon` prop declaration in the `propTypes` object by using the new fragment and the `propType` function from `graphql-anywhere`:

```js
export default class PokemonCard extends React.Component {

  static propTypes = {
    pokemon: propType(pokemonCardFragments.pokemon).isRequired,
  }

  // ...
}
```

If the incoming `pokemon` prop is missing or doesn't have a field that is included in the fragment, we will see a warning when using the component.

### Using the PokemonCardPokemon fragment in `PokemonPage`

Let's now update our `PokemonQuery` with the new `PokemonCardPokemon` fragment:

```js
const PokemonQuery = gql`
  query PokemonQuery($id: ID!) {
    Pokemon(id: $id) {
      ... PokemonCardPokemon
    }
  }
  ${PokemonCard.fragments.pokemon}
`
```

Note that we select the fragment in the query using the `...` syntax, and that we additionally include the fragment after the query with `${PokemonCard.fragments.pokemon}`.

We can see that the `PokemonPage` component doesn't need to know anything about the `PokemonCardPokemon` fragment, other than the fact that it is a fragment on the Pokemon type.

### Filtering objects with fragments

Right now we are passing the object `pokemon` to `PokemonCard`:

```js
const pokemon = this.props.data.Pokemon

return (
  <View
    style={{
      flex: 1,
      marginTop: 64
    }}
  >
    <PokemonCard pokemon={pokemon}/>
  </View>
)
```

A nice thing we can add is the filtering of the `pokemon` object when passing it as a prop by using the `filter` method of the fragments. First, we need to include the `filter` method from `graphql-anywhere`:

```js
import { filter } from 'graphql-anywhere'
```

Then we can use it when passing the `pokemon` as a prop:

```js
const pokemon = this.props.data.Pokemon

return (
  <View
    style={{
      flex: 1,
      marginTop: 64
    }}
  >
    <PokemonCard pokemon={filter(pokemonCardFragments.pokemon, pokemon)}/>
  </View>
)
```

This will make sure that only the required fields of the `pokemon` object get passed to `PokemonCard`. If we need additional fields later, for example in `PokemonCard`, we just have to add them in the fragment defined in `PokemonCard`.

Check if you got everthing right by running react-native:

```sh
react-native start
react-native run-ios # or react-native run-android
```

Go to the detailed view of a pokemon by clicking on its image in the pokedex. It should work the same as before.

## Recap

Congratulations, you increased the modularity of your components by introducing fragments. We learned a lot about fragments, let's do a quick recap:

* **Co-located fragments** help to decouple the declaration of data requirements
* Fragments can be used to **define required propTypes**
* The fragments of the child components can be used to **filter passed props** to only include the required fields of the respective child component
