# Basic Mutations - React-Native Tutorial (5/6)


Welcome to the 5th exercise in the **React Native Track** of this Apollo Client Tutorial!

## Goal

In this exercise we have the **goal** of adding the possibility to create new pokemons:

![](../images/react-native-exercise-05-addpokemon.png)

A button in the pokedex will redirect to the new component. After creating the pokemon it will appear in our pokedex:

![](../images/react-native-exercise-05-pokedex.png)

Data changes in GraphQL are done by using mutations, so it's time for us to learn about them.

## Introduction

Move to the 5th exercise and install the dependencies from your console:

```sh
cd pokedex-react-native/exercise-05
yarn install # or npm install
```

## Adding new pokemons to the pokemon list

Currently we have a cool, shiny list of pokemons that are assigned to our trainer node. However, pokemon trainers are supposed to catch new pokemons once in a while, so we should account for that in our pokedex.

### Adding a button to the `Pokedex`

We already prepared a new component `AddPokemonCard` that lets us create new pokemons and associated it with the `createPokemon` route in `index.js`:

```js
const scenes = Actions.create(
  <Scene key='root'>
    <Scene key='pokedex' component={Pokedex} title='Pokedex' initial={true} type={ActionConst.RESET} />
    <Scene key='pokemonPage' title='Edit Pokemon' component={PokemonPage} type={ActionConst.PUSH} />
    <Scene key='createPokemon' title='Create Pokemon' component={AddPokemonCard} type={ActionConst.PUSH} />
  </Scene>
)
```

We can now add a new button to our `Pokedex` component that redirects to the new `AddPokemonCard` component.

As we need to know which trainer gets assigned the new pokemon, we pass the trainer id when redirecting. This is the new `render` method of `Pokedex`:

```js@components/Pokedex.js
render () {
  if (this.props.data.loading) {
    return (<CustomText style={{marginTop: 64}}>Loading</CustomText>)
  }

  if (this.props.data.error) {
    console.log(this.props.data.error)
    return (<CustomText style={{marginTop: 64}}>An unexpected error occurred</CustomText>)
  }

  return (
    <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
    <CustomText
      style={{
        marginTop: 64,
        padding: 16,
        fontSize: 24,
        textAlign: 'center'
      }}
    >
      Hey {this.props.data.Trainer.name}!
    </CustomText>
    <CustomText
      style={{
        padding: 16,
        paddingTop: 0,
        fontSize: 18,
        textAlign: 'center'
      }}
    >
      There are {this.props.data.Trainer.ownedPokemons.length} Pokemons in your pokedex
    </CustomText>
      <ScrollView>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            margin: 6,
          }}
        >
          {this.props.data.Trainer.ownedPokemons.map((pokemon) =>
            <PokemonPreview key={pokemon.id} pokemon={pokemon} />
          )}
        </View>
      </ScrollView>
      <Button
        title='Add Pokemon'
        onPress={() => {
          const trainerId = this.props.data.Trainer.id
          Actions.createPokemon({trainerId})
        }}
      />
    </View>
  )
}
```

Note that we require the trainer id now but didn't need it before, so we should add it to our `TrainerQuery` as well:

```js@components/Pokedex.js
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

### Adding the createPokemon mutation to `AddPokemonCard`

Right now, the `AddPokemonCard` doesn't do too much. As we want to create a new pokemon node at the server, now is the time to think about the right mutation for this. Let's first think about the data that is needed for creating a new pokemon. Of course, we need the name and the image URL of the new pokemon. Additionally we also need the trainer id to relate the pokemon to the trainer and vice-versa. The mutation we need to use is called `createPokemon`, which leaves us with the following mutation:

```js@components/AddPokemonCard.js
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

Note that as we discussed above, the mutation requires the variables `$name`, `$url` and `$trainerId`. Instead of only using `export default AddPokemonCard` we can inject the mutation similar to how we inject queries to `AddPokemonCard`:

```js@components/AddPokemonCard.js
const AddPokemonCardWithMutation = graphql(createPokemonMutation)(AddPokemonCard)

export default AddPokemonCardWithMutation
```

But wait, how do we supply the needed variables to the mutation? Let's find out!

### Using mutations in components

Other than with queries, injecting mutations doesn't add the query result but the mutation itself as a function. Inside the wrapped component, we can access the mutation via `this.props.mutate`, which is a function that accepts the mutation variables as parameters. So let's first add the new required prop `mutate` at the top of the `AddPokemonCard` class:

```js@components/AddPokemonCard.js
static propTypes = {
  mutate: React.PropTypes.func.isRequired,
}
```

Now we can call the `createPokemon` mutations by using `mutate` in `handleSave`:

```js@components/AddPokemonCard.js
handleSave = async () => {
  const {name, url} = this.state
  const trainerId = this.props.trainerId
  await this.props.mutate({variables: {name, url, trainerId}})
   
  Actions.pokedex()
}
```

Note how we provide the variables using the `variables` object. Since the mutation returns a `Promise`, we have to `await` its result before we can return back to the pokemon list. (In case you're not yet familiar with the `async`/`await` syntax, you can [read more about it here](https://ponyfoo.com/articles/understanding-javascript-async-await).)

Check if you got everthing right by running the app:

```sh
yarn start
```


Click the add button. Add the pokemon name and image URL and click the save button. Weird, the pokemon is not displayed right away, only after refreshing the page

## Data Normalization and the Apollo store

To fix this, we have to help Apollo Client out a bit. Unlike Relay, Apollo is not opinionated about if or how objects in query and mutation responses are identified. In our case, all nodes have an `id` field. We can tell Apollo that nodes are identified by this when setting up the `client` in `index.js` like this:

```js@index.js
const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__'}),
  dataIdFromObject: o => o.id,
})
```

Note that we added the `dataIdFromObject` function to express this relation. Here, we map an object to its id field. How you handle data normalization with `dataIdFromObject` depends on your GraphQL server and schema. You can find out more in the excursion about [data normalization and managing Apollo store](/excursions/excursion-02).

## Recap

Now that you got to use mutations you already know a lot about Apollo Client, good job! Let's review what we saw in this exercise:

* **Mutations** are used to change data on the server
* Calling mutations returns a **promise that can be used to react on mutation results**
* **Wrapping a component with `graphql`** from `react-apollo` using a mutation injects the `mutate` prop to the inner component
* Other than with queries, **mutation variables can be assigned in the inner component** making it easy to use the components state as variable inputs
