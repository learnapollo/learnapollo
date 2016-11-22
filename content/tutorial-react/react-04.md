# Tutorial 04 - Fragments

Welcome to the 4th exercise in the **React Track** of this Apollo Client Tutorial! If you prefer React Native or Angular 2 over React, head over to the respective tutorial track.

## Goal

The **goal** of this exercise is to add some information to the pokemon detail view about the pokemon's trainer. We will use fragments and learn how they can be used to define data requirements that are co-located with the component requiring that data.

## Introduction

Change to the 4th exercise of the Pokedex React App and install the dependencies from your console

```sh
cd pokedex-react/exercise-04
yarn install
```

## Adding information to the pokemon page

Before we add additional content to our components, let's take a step back. Right now, `PokedexPage` defines a `PokemonQuery` that fetches the pokemon needed to render the `PokemonCard` component. This results in a few disadvantages when we want to make changes later:

* if the data requirements of the `PokemonCard` component change, we have to go back to the `PokedexPage` and add additional fields to the `PokemonQuery`
* if we want to include `PokemonCard` in a another component, we will have to duplicate the `PokemonQuery`, resulting in possible errors when we have to change the query later and forget to update all places it's defined

Therefore it would be great to let the `PokemonCard` component handle the declaration of its own data requirements. Then we could refer to this in the `PokedexPage` component to make sure that we  included all required data in the `PokemonQuery`. This is exactly the way fragments work.

### Defining a pokemon fragment in `PokemonCard`

To help you get started using fragments, we implemented them already in `PokemonCard`. There, we make use of the package `graphql-anywhere` to define the `PokemonCardPokemon` fragment in `src/components/PokemonCard.js` just before defining the `propTypes`:

```js
static fragments = {
pokemon: gql`
  fragment PokemonCardPokemon on Pokemon {
    url
    name
  }
`
}
```

We also replaced the `pokemon` prop declaration in the `propTypes` object by using the new fragment and the `propType` function from `graphql-anywhere`:

```js
static propTypes = {
  pokemon: propType(PokemonCard.fragments.pokemon).isRequired,
  handleCancel: React.PropTypes.func.isRequired,
}
```

If the incoming `pokemon` prop is missing or doesn't have a field that is included in the fragment, we will see a warning when using the component.

### Using the PokemonCardPokemon fragment in `PokedexPage`

We updated our `PokemonQuery` with the new `PokemonCardPokemon` fragment:

```js
const PokemonQuery = gql`query($id: ID!) {
    Pokemon(id: $id) {
      ... PokemonCardPokemon
    }
  }
  ${PokemonCard.fragments.pokemon}  
`
```

Note that we select the fragment in the query using the `...` syntax, and that we additionally include the fragment after the query with `${PokemonCard.fragments.pokemon}`.

We can see that the `PokemonPage` component doesn't need to know anything about the `PokemonCardPokemon` fragment, other than the fact that it is a fragment on the Pokemon type.

### Defining a pokemon fragment in `PokemonCardHeader`

Now it's your turn to use fragments! You should use the same steps to define a `PokemonCardHeaderPokemon` fragment in the `PokemonCardHeader` component that you can find in `src/components/PokemonCardHeader.js`. First, you have to import `propType` from `graphql-anywhere`

```js
import { propType } from 'graphql-anywhere'
```

and define the new fragment just before `propTypes` are defined:

```js
static fragments = {
pokemon: gql`
  fragment PokemonCardHeaderPokemon on Pokemon {
    name
    trainer {
      name
    }
  }
`
}
```

Note that this fragment includes different fields as the other fragment we saw before. That's because the `PokemonCardHeader` component needs different information of the pokemon object than the `PokemonCard` component. As we did before, use the fragment now to define the `pokemon` `propType`:

```js
static propTypes = {
  pokemon: propType(PokemonCardHeader.fragments.pokemon).isRequired,
}
```

### Combining multiple fragments in `PokemonPage`

Now we can include the `PokemonCardHeader` component just above the `PokemonCard` component in the render method of the `PokedexPage` component:

```js
render () {
  if (this.props.data.loading) {
    return (<div>Loading</div>)
  }

  const pokemon = this.props.data.Pokemon

  return (
    <div>
      <PokemonCardHeader pokemon={pokemon} />
      <PokemonCard pokemon={pokemon} handleCancel={this.goBack}/>
    </div>
  )
}
```

Again, we have to also use the `PokemonCardHeaderPokemon` fragment in the `PokemonQuery`:

```js
const PokemonQuery = gql`query($id: ID!) {
    Pokemon(id: $id) {
      ... PokemonCardPokemon
      ... PokemonCardHeaderPokemon
    }
  }
  ${PokemonCardHeader.fragments.pokemon}
  ${PokemonCard.fragments.pokemon}  
`
```

Note that there are fields that are included either in both fragments (like `name`) or only in one of them (like `url` or `trainer`).

Let's add the new fragment when wrapping the `PokedexPage` component as well:

```js
const PokemonPageWithData = graphql(PokemonQuery, {
  options: (ownProps) => ({
      variables: {
        id: ownProps.params.pokemonId
      }
    })
  }
)(withRouter(PokemonPage))

export default PokemonPageWithData
```

### Filtering objects with fragments

As stated above, both introduced fragments include fields that the other one doesn't include. Right now we are passing the same `pokemon` object to both `PokemonCard` and `PokemonCardHeader`:

```js
const pokemon = this.props.data.Pokemon

return (
  <div>
    <PokemonCardHeader pokemon={pokemon} />
    <PokemonCard pokemon={pokemon} handleCancel={this.goBack}/>
  </div>
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
  <div>
    <PokemonCardHeader pokemon={filter(PokemonCardHeader.fragments.pokemon, pokemon)} />
    <PokemonCard pokemon={filter(PokemonCard.fragments.pokemon, pokemon)} handleCancel={this.goBack}/>
  </div>
)
```

This will make sure that only the required fields of the `pokemon` object get passed to `PokemonCard` and `PokemonCardHeader`, respectively. If we need additional fields later, for example in `PokemonCard`, we just have to add them in the fragment defined in `PokemonCard`.

Check if you got everthing right by running the app:

```sh
yarn start
```

Open [http://localhost:3000](http://localhost:3000) in your browser and open the detailed view of a pokemon. It should have a new message about the pokemon and its trainer at the top of the page.

## Recap

Congratulations, you increased the modularity of your components by introducing fragments. We learned a lot about fragments, let's do a quick recap:

* **Co-located fragments** help to decouple the declaration of data requirements
* Using **multiple fragments** in a parent component is easy and merges the selected fields of the different child components
* The fragments of the child components can be used to **filter passed props** to only include the required fields of the respective child component
