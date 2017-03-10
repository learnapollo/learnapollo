# Tutorial 04 - Fragments

Welcome to the 4th exercise in the **React Native Expo Track** of this Apollo Client Tutorial!

## Goal

The **goal** of this exercise is to add some information to the pokemon detail view about the pokemon's trainer.

We will use fragments and learn how they can be used to define data requirements that are co-located with the component requiring that data.

## Introduction

Change to the 4th exercise, install the dependencies and run the Expo XDE

```sh
cd pokedex-react-native/exercise-04-initial
yarn add graphql-anywhere # or npm install --save graphql-anywhere
yarn install # or npm install
```

## Adding information to the pokemon page

Before we add additional content to our components, let's take a step back.
Right now, the `PokemonsListScreen` render a `PokemonsList` components that defines a `TrainerQuery`.
This query fetches the pokemon needed to render the `PokemonListItem` component.
This results in a few disadvantages when we want to make changes later:

* if the data requirements of the `PokemonListItem` component change, we have to go back to the `PokemonsList` and
add additional fields to the `TrainerQuery`
* if we want to include `PokemonListItem` in a another component, we will have to duplicate the `TrainerQuery`,
resulting in possible errors when we have to change the query later and forget to update all places it's defined

Therefore it would be great to let the `PokemonListItem` component handle the declaration of its own data requirements.
Then we could refer to this in the `PokemonsList` component to make sure that we included all required data in the
`PokemonQuery`.

This is exactly the way fragments work.

### Defining a pokemon fragment in `PokemonListItem`

To help you get started using fragments, we implemented them already in `PokemonListItem`.
There, we make use of the package `graphql-tag` to define the `PokemonCardPokemon`
fragment in `src/components/PokemonCard.js` just before defining the `propTypes`:

```js
export class PokemonListItem extends React.Component {
  static fragments = {
    pokemon: gql`
      fragment PokemonListItemPokemon on Pokemon {
        id
        url
        name
      }
    `
  }
  //....
}
```

The fragment is name `PokemonListItemPokemon`, because it is defined on the `PokemonListItem` component and is a
fragment for a `Pokemon`.

Using this naming convention consistently can be helpful when using the fragment elsewhere.

We also replaced the `pokemon` prop declaration in the `propTypes` object by using the new fragment and
the `propType` function from `graphql-anywhere`:

```js
PokemonListItem.propTypes = {
  pokemon: propType(PokemonListItem.fragments.pokemon).isRequired,
}
```

If the incoming `pokemon` prop is missing or doesn't have a field that is included in the fragment,
we will see a React Native yellow warning box when using the component.

### Using the PokemonCardPokemon fragment in `PokedexPage`

We updated our `TrainerQuery` with the new `PokemonListItemPokemon` fragment:

```js
const TrainerQuery = gql`
  query {
    Trainer(name: "Tycho") {
      name
      ownedPokemons {
        ...PokemonListItemPokemon
      }
    }
  }
  ${PokemonListItem.fragments.pokemon}
`
```

Note that we select the fragment in the query using the `...` syntax, and that we additionally include the fragment
after the query with `${PokemonListItem.fragments.pokemon}`.

We can see that the `PokemonsList` component doesn't need to know anything about the `PokemonListItem` fragment,
other than the fact that it is a fragment on the Pokemon type.

In the same way, go ahead and replace the Trainer 's id and name field by a fragment in the `Title` component.

### Filtering objects with fragments

Right now we are passing the whole `trainer` and for each owned pokemons, the whole `pokemon` object to the `Title` component.

But `Title` does not need the `name` and `url` fields of `ownedPokemons`.

A nice thing we can add is the filtering of the `pokemon` object when passing it as a prop by using the `filter`
method on the trainer . First, we need to include the `filter` method from `graphql-anywhere`:

Then we can filter on the following fragments that you should define on the `Title` component

```js
  static fragments = {
    trainer: gql`
      fragment TitleTrainer on Trainer {
        id
        name
        ownedPokemons {
          id
        }
      }
    `
  }
```

```js
import { filter } from 'graphql-anywhere'
```

Then we can use it when passing the `trainer` as a prop:

```js
  _renderHeader = (trainer) => (
    <Title
      trainer={filter(Title.fragments.trainer, this.props.data.Trainer)}
    />
  );
```

This will make sure that only the required fields of the `pokemon` object get passed to `Title` component.
If we need additional fields later, for example in `PokemonCard`, we just have to add them in the fragment defined
in `PokemonCard`.

Check if you got everthing right by opening the XDE and navigating to the detailed view of a pokemon.

## Recap

Congratulations, you increased the modularity of your components by introducing fragments.
We learned a lot about fragments, let's do a quick recap:

* **Co-located fragments** help to decouple the declaration of data requirements
* The fragments of the child components can be used to **filter passed props** to only include the required
fields of the child component
