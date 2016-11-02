# React Track 04 - Fragments

Welcome to the 4th exercise in the **React Track** of this Apollo Client Tutorial! If you prefer React Native or Angular 2 over React, head over to the respective tutorial track.

## Goal

The **goal** of this exercise is to add some information to the pokemon detail view about the pokemon's trainer. We will use fragments and learn how they can be used to define data requirements that are co-located with the component requiring that data.

## Introduction

Checkout the 4th exercise of the Pokedex React App and install the npm dependencies from your console

```sh
cd pokedex-react
git checkout exercise-04
npm install
```

## Adding information to the pokemon page

Before we add additional content to our components, let's take a step back. Right now, `PokedexPage` defines a `PokemonQuery` that fetches the pokemon needed to render the `PokemonCard` component. This results in a few disadvantages when we want to make changes later:

* if the data requirements of the `PokemonCard` component change, we have to go back to the `PokedexPage` and add additional fields to the `PokemonQuery`
* if we want to include `PokemonCard` in different parent component than `PokedexPage`, we will have to duplicate the `PokemonQuery` in that other component again

Therefor it would be great to let the `PokemonCard` component handle the declaration of its data requirements. Then we could make sure in the `PokedexPage` component to include the required data in the `PokemonQuery`. This is exactly the way fragments work.

### Defining a pokemon fragment in `PokemonCard`

To start using fragments, we can make use of the package `graphql-fragments` in `PokemonCard`. With that package, we can define the `PokemonCardPokemon` fragment in `src/components/PokemonCard.js` just before defining the `propTypes`:

```js
static fragments = {
  pokemon: new Fragment(gql`
    fragment PokemonCardPokemon on Pokemon {
      imageUrl
      name
    }
  `)
}
```

We can also replace the `pokemon` prop declaration in the `propTypes` object by using the newly created fragment:

```js
static propTypes = {
  pokemon: PokemonCard.fragments.pokemon.propType,
  handleCancel: React.PropTypes.func.isRequired,
}
```

Note that the `propType` of a fragment is already required. If the incoming `pokemon` prop is missing or doesn't have a field that is included in the fragment, we will see a warning when using the component.

### Using the PokemonCardPokemon fragment in `PokedexPage`

Now we can use the new `PokemonCardPokemon` fragment to declare our `PokemonQuery`:

```js
const PokemonQuery = gql`query($id: ID!) {
    Pokemon(id: $id) {
      ... PokemonCardPokemon
    }
  }
`
```

### Defining a pokemon fragment in `PokemonCardHeader`

Now you should use the same principle to define a `PokemonCardHeaderPokemon` fragment in the `PokemonCardHeader` component that we added in `src/components/PokemonCardHeader.js`. You have to import `graphql-fragments`

```js
import Fragment from 'graphql-fragments'
```

and define the new fragment:

```js
static fragments = {
  pokemon: new Fragment(gql`
    fragment PokemonCardHeaderPokemon on Pokemon {
      name
      trainer {
        name
      }
    }
  `)
}
```

Note that we included different fields for this fragment, as the `PokemonCardHeader` component needs different information of the pokemon object than the `PokemonCard` component. As seen above, we can also use the fragment for the `pokemon` `propType`:

```js
static propTypes = {
  pokemon: PokemonCardHeader.fragments.pokemon.propType,
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
`
```

Note that the two fragments both include the `name` field on `Pokemon`, but both fragments have fields that only one of the includes.

Let's add the new fragment when wrapping the `PokedexPage` component as well:

```js
const PokemonPageWithData = graphql(PokemonQuery, {
  options: (ownProps) => ({
      variables: {
        id: ownProps.params.pokemonId
      },
      fragments: [PokemonCardHeader.fragments.pokemon.fragments(), PokemonCard.fragments.pokemon.fragments()]
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

A nice thing we can add is the filtering of the `pokemon` object when passing it as a prop by using `fragment.filter`:

```js
const pokemon = this.props.data.Pokemon

return (
  <div>
    <PokemonCardHeader pokemon={PokemonCardHeader.fragments.pokemon.filter(pokemon)} />
    <PokemonCard pokemon={PokemonCard.fragments.pokemon.filter(pokemon)} handleCancel={this.goBack}/>
  </div>
)
```

This will make sure that only the required fields of the `pokemon` object get passed to `PokemonCard` and `PokemonCardHeader`, respectively.

Check if you got everthing right by running the app:

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser and open the detailed view of a pokemon. It should have a new message about the pokemon and it's trainer at the top of the page.

## Recap

* **Co-located fragments** help to decouple the declaration of data requirements
* Using **multiple fragments** in a parent component is easy and merges the selected fields of the different child components
* The fragments of the child components can be used to **filter passed props** to only include the required fields of the respective child component
