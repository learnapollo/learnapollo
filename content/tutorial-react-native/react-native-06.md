# Multiple Mutations - React-Native Tutorial (6/6)


Welcome to the 6th exercise in the **React Native Track** of this Apollo Client Tutorial!

## Goal

The **goal** of this exercise is to add the possibility to update and delete existing pokemons:

![](../images/react-native-exercise-06-pokemonpage.png)

This will both let you increase your understanding of mutations as well as show you how you can add multiple mutations to the same component.

## Introduction

Change to the 6th exercise and install the dependencies from your console:

```sh
cd pokedex-react/exercise-06
yarn install # or npm install
```

## Updating and deleting pokemons

Let's use what we learned about mutations in the last exercise to start using the `updatePokemon` and `deletePokemon` mutations.
You will add an update and a delete button to the `PokemonCard` component that call the according mutation when clicked. Let's get started then!

### Changes to `PokemonCard`

We already prepared some changes to the `PokemonCard` component and updated `PokemonPage` accordingly. Let's have a closer look at `PokemonCard`. First of all, we introduced `name` and `url` as part of the component's state:

```js
state = {
  name: this.props.pokemon.name,
  url: this.props.pokemon.url,
}
```

The state gets initialized with the passed props and `onChangeText` events for the two new `TextInput` elements update the according part of the state:

```js
<View>
  <TextInput
    style={{
      padding: 20,
      height: 60,
      fontFamily: 'HelveticaNeue-Light',
    }}
    onChangeText={(name) => this.setState({name})}
    value={this.state.name}
    placeholder='Type a name...'
  />
  <TextInput
    style={{
      padding: 20,
      height: 60,
      fontFamily: 'HelveticaNeue-Light',
    }}
    onChangeText={(url) => this.setState({url})}
    value={this.state.url}
    placeholder='Image Url'
  />
</View>
```

The update and delete buttons were added:

```js
<View
  style={{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12
  }}
>
  <Button
    title='Delete'
    onPress={this.handleDelete}
    color='red'
  />
  {updateButton}
</View>
```

The `updateButton` is only shown if the input fields have updated values:

```js
let updateButton = null
if (this.canUpdate()) {
  updateButton = <Button
    title='Update'
    onPress={this.handleUpdate}
  />
}
```

However, you have to implement the `handleUpdate` and `handleDelete` methods yourself. Before that, let us define the required mutations together. As both mutations need the `id` of the pokemon, we have to update the `pokemon` fragment in the `PokemonCard` by adding the `id`:

```js@components/PokemonCard.js
static fragments = {
  pokemon: gql`
    fragment PokemonCardPokemon on Pokemon {
      id
      url
      name
    }
  `
}
```

### The `updatePokemon` mutation

We want to be able to update pokemon names and image URLs. That's why we make use of `updatePokemon` and its arguments `name` and `url`. Add this mutation to the `PokemonCard`:

```js@components/PokemonCard.js
const updatePokemon = gql`
  mutation updatePokemon($id: ID!, $name: String!, $url: String!) {
    updatePokemon(id: $id, name: $name, url: $url) {
      id
      name
      url
    }
  }
`
```

You can also use fragments in mutations the same way you do in queries. We could write the `updatePokemon` mutation like this as well:

```js
const updatePokemon = gql`
  mutation updatePokemon($id: ID!, $name: String!, $url: String!) {
    updatePokemon(id: $id, name: $name, url: $url) {
      id
      ... PokemonCardPokemon
    }
  }
  ${PokemonCard.fragments.pokemon}
`
```

We included the `id` in the query selection for good measure, even though it is already included in the `PokemonCardPokemon` fragment.

Let's now think about the `deletePokemon` mutation before we will use both mutations and inject them to `PokemonCard`.

### The `deletePokemon` mutation

The `deletePokemon` mutation only needs the `id` pokemon to delete it. Add it to `PokemonCard` as well:

```js@components/PokemonCard.js
const deletePokemon = gql`
  mutation deletePokemon($id: ID!) {
    deletePokemon(id: $id) {
      id
    }
  }
`
```

### Combining multiple mutations when wrapping components

Now it's time for you to inject these mutations to `PokemonCard`. By default, injected mutations are accessible with `this.props.mutate`. But how can we inject multiple mutations? We simply provide a `name` option:

```js@components/PokemonCard.js
const PokemonCardWithMutations =  graphql(deletePokemon, {name : 'deletePokemon'})(
  graphql(updatePokemon, {name: 'updatePokemon'})(PokemonCard)
)

export default PokemonCardWithMutations
```

This results in the two new props `updatePokemon` and `deletePokemon`, so let's reflect that when defining the `propTypes`:

```js@components/PokemonCard.js
static propTypes = {
  pokemon: propType(pokemonCardFragments.pokemon).isRequired,
  updatePokemon: React.PropTypes.func.isRequired,
  deletePokemon: React.PropTypes.func.isRequired,
}
```

### Connect the buttons with the mutations

Finally, you can now call the mutations from within the `onClick` of the buttons:

```js@components/PokemonCard.js
handleUpdate = async () => {
  await this.props.updatePokemon({variables: { id: this.props.pokemon.id, name: this.state.name, url: this.state.url }})
  
  Actions.pokedex()
}

handleDelete = async () => {
  await this.props.deletePokemon({variables: { id: this.props.pokemon.id }})
  
  Actions.pokedex()
}
```

Again, we are making use of the promise returned by the mutations to call another function after the mutation results came in.

Check if you got everthing right by running the app:

```sh
yarn start
```

Click on an existing pokemon button. Update one of its attributes and click the update button. You should get back to the updated pokemon list. Repeat the same but this time delete the pokemon.

## Force fetching for a consistent UI

If you played around a bit with deleting pokemons, you will notice that it is only reflected in our UI after we refresh the page.
We already saw this issue in the last exercise with the creation of pokemons and fixed it by telling the Apollo Store how to uniquely identify objects in our application, namely by their `id` field. We also included the `Trainer` object in the mutation response of `createPokemon`:

```js
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

What this does, is telling Apollo Client to refetch the trainer object and all its related pokemons whenever we create a new pokemon. Apollo Store identifies the trainer object by its `id` and it basically merges the known pokemons with all the pokemons in the mutation response. Even though this is highly inefficient, this works in our example.

Now the question is, if we can use the same logic for the deletion of pokemons. What if we changed the `deleteMutation` to also query the trainer and all its pokemons after the deletion of a pokemon?

```js
const deletePokemon = gql`
  mutation deletePokemon($id: ID!) {
    deletePokemon(id: $id) {
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

As before, Apollo Client will merge the previously known pokemons with the pokemons in this mutation response. As the previous known pokemons already contain the now deleted pokemons, the pokemon will still be in the Apollo's store after this deletion. As things like filters on fields exist, there is no way for Apollo to know that in our case, we are fetching all the pokemon ids there are and not only a subset. A quick fix to make things work, is to force fetch the trainer object whenever the pokedex is being rendered. The `fetchPolicy: 'cache-and-network'` option tells Apollo to first return the result from cache (if it exists), and then return the network result once it's available.

To do this, head over to the `Pokedex` component in `components/Pokedex.js` again and add the `fetchPolicy: 'cache-and-network'` option to the options of the query:

```js@components/Pokedex.js
const PokedexWithData = graphql(TrainerQuery, {
  options: {
    variables: {
      name: '__NAME__'
    },
    fetchPolicy: 'cache-and-network',
  }
})(Pokedex)

export default PokedexWithData
```

Now we can also get rid of fetching the trainer object in `AddPokemonCard` in `components/AddPokemonCard.js` after creating a new pokemon:

```js@components/AddPokemonCard.js
const createPokemonMutation = gql`
  mutation createPokemon($name: String!, $url: String!, $trainerId: ID) {
    createPokemon(name: $name, url: $url, trainerId: $trainerId) {
      id
    }
  }
`
```

To learn more about handling the Apollo Store and get to know more efficient ways of handling situations like these, check out [the excursion on managing Apollo store](/excursions/excursion-02).

## Recap

* We saw how we can **update and delete** pokemons using mutations
* **Injecting multiple mutations** is possible by using the `name` option
* We learned a bit about how **caching** works with Apollo Client and used **force fetching** for a consistent but inefficient UI when creating or deleting nodes
