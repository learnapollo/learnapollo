# Tutorial 03 - Advanced Queries

This is the third exercise in the **React Native Exponent Track** of this Apollo Client Tutorial!

## Goal

In this exercise we will have a look at advanced query features with the **goal** of showing a list of pokemon that our
trainer owns. Upon clicking on a pokemon in this list, we will see a detailed view of that pokemon and can navigate back
to the complete pokedex.

## Introduction

Move to the third exercise of the Pokedex React Native App and install the dependencies from your console

```sh
cd pokedex-react-native/exercise-03-initial
yarn install
```

## Display a list of pokemon with advanced queries

Before we start working directly on our goal to show the pokemons a trainer owns, let's take some time to get more
familiar with some of the available options when using queries.

### Static Query Variables

One of the available query options are variables. A common use case for query variables is when we want to display
the same type of information for two different nodes. We will see that use case shortly, but for now we are introducing
a query variable to the `TrainerQuery`. This is how it looked like at the end of the last exercise:

```js
const TrainerQuery = gql`query {
  Trainer(name: "__NAME__") {
     name
   }
 }`
```

To introduce a variable for the trainer `name`, we have to add the `$name` argument to the query parameters and assign
it to the `name` argument of `Trainer`:

```js
const TrainerQuery = gql`query($name: String!) {
  Trainer(name: $name) {
    name
  }
}`
```

Note that we have to denote the variable type as well, `String!` signifying a required String in this case. Of course,
now we also have to supply a value for that variable when we use it to wrap the `Pokedex` component:

```js
export const TitleWithData = graphql(TrainerQuery, {
options: {
    variables: {
      name: "__NAME__"
    }
  }
})(Title)
```

### Nested Queries

Now that we saw query variables in action we can focus on displaying the pokemons of a given trainer. We will use the a
React Native ListView as it is the most pragmatic way to display a list of elements in a mobile app, while being
performant out of the box.

Each Row will render a `PokemonListItem` component that you can find in `screen/PokemonsListScreen/components/PokemonListItem.js`
to display the individual pokemons:

```js
// imports ...

export class PokemonListItem extends React.Component {
  static propTypes = {
    pokemon: React.PropTypes.object.isRequired,
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: this.props.pokemon.url }}
        />
        <View style={styles.text}>
          <BaseText
            fontFace="source-sans"
            style={{ fontSize: 14 }}
          >
            {this.props.pokemon.name}
          </BaseText>
        </View>
      </View>
    )
  }
}

// inline styles ...
```

All it depends on is the `pokemon` prop, that we have to inject in the `Pokedex` component. Remember the structure of
the `Trainer` and the `Pokemon` types:

```graphql
type Trainer {
  id: String!
  name: String!
  ownedPokemons: [Pokemon]
}

type Pokemon {
  id: String!
  url: String!
  name: String!
  trainer: Trainer
}
```

As we can see, the server stores the owned pokemons of each trainer, exactly the information that we need!
We can now add the `ownedPokemons` field to our `TrainerQuery`. Let's include the `id`, `url` and `name` in the nested selection:

```js
const TrainerQuery = gql`query($name: String!) {
  Trainer(name: $name) {
    id
    name
    ownedPokemons {
      id
      name
      url
    }
  }
}`
```

Once the query has finished, `this.props.data.Trainer` in the `Pokedex` component contains the `ownedPokemons` object
that gives access to the information we selected. We can now map over the pokemons in `ownedPokemons` to include the
`PokemonPreview` components in the `Pokedex` component.

Instead of doing something like :

```js
render () {
   // ...

    return (
      <View>
        {this.props.data.Trainer.ownedPokemons.map((pokemon) =>
          <PokemonListItem key={pokemon.id} pokemon={pokemon} />
        )}
      </View>
    )
  }
```

we are going to use react native ListView for multiple reasons :
- it makes possible to render separator between the row, header, or footer
- it renders only the visible components preventing to load to much images for instance
- it recycles the unvisible components to prevent excessive element creation.

This make possible to create fluid scroll view at 60 FPS, which is really important for the end user.

```js
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  ActivityIndicator,
  RecyclerViewBackedScrollView as RecyclerScrollView,
} from 'react-native';

export class PokemonsList extends Component {
  constructor(props){
    super(props);
    // Create the data sructure that will handle the row and initialize empty
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    // Only change the rows if some data is comming
    if (!data.loading && !data.error) {
      const { dataSource } = this.state;
      this.setState({
        dataSource: dataSource.cloneWithRows(data.Trainer.ownedPokemons),
      });
    }
  }

  render() {
    if (this.props.data.error) {
      // return error text
    }

    if (this.props.data.loading) {
      // return ActivityIndicator loader
    }

    return (
      <ListView
        enableEmptySections
        dataSource={this.state.dataSource} // the datastructure
        renderRow={this._renderItem}
        renderHeader={this._renderHeader}
        renderScrollComponent={props => <RecyclerScrollView {...props} />}
        renderSeparator={this._renderSeparator}
        style={styles.listView}
        pageSize={1}
        initialListSize={10}
      />
    );
  }

  _renderItem = (pokemon) => (
    <PokemonListItem pokemon={pokemon} />
  );

  _renderHeader = (trainer) => (
    <Title trainer={this.props.data.Trainer} />
  );

  _renderSeparator = (sectionID, rowID) => (
    <View
      key={`${sectionID}-${rowID}`}
      style={{ height: 1, backgroundColor: '#CCCCCC'}}
    />
  );
}
```

You can then modify `Title` to accept `this.props.data.Trainer` as props `trainer` and use of
`this.props.trainer.ownedPokemons.length` that displays the correct amount of pokemons.

To confirm your environment is all correctly setup, start the app now from XDE.


### Dynamic Query Variables

If everything is working, we can now continue to implement a detailed view of a single pokemon when we click on a
`PokemonListItem` component.

Note that we could have used the existing data from the list to render the whole screen without an extra request, but
we will still do the extra request to show you how to customize the request based on the route.

Have a look at the `PokemonDetailScreen` directory that we prepared for you.

We already created the navigation in `navigation/` that assigns the `PokemonDetailScreen` to the path `pokemonDetail`
so we can `.push(Router.getRoute('pokemonDetail'))` to change page.
Exponent navigation allows us to pass extra parameters to the route like this :

```js
_goToDetail = (pokemon) => {
  this.props.navigation
    .getNavigator('root')
    .push(Router.getRoute('pokemonDetail', { pokemon }));
}
```

In a mobile App, we want the tab bar to be visible only on the first page, and to be hidden, while we go deep in the
navigation tree : that is exactly what `getNavigator` allows us to do.
Selecting the root navigator and pushing routes directly on top of it overides the tab bar navigator and thus hide it.

The back button in the nav bar and the native back button is handled by default by exponent-navigation.

Then, in the `PokemonDetailScreen`, we can get the paramater `pokemonId` like this:

```js
<PokemonDetailWithData pokemonId={this.props.route.params.pokemon.id}/>
}
```

The `PokemonDetailScreen` component is responsible to pass down a `pokemonId` to the `PokemonDetail` component.
Let's add a `PokemonQuery` to `PokemonDetail` that is fetching the required pokemon object:

```js
const PokemonQuery = gql`
  query PokemonQuery($id: ID!) {
    Pokemon(id: $id) {
      id
      url
      name
    }
  }
`
```

As you can see, the query requires a query variable `id` of type `ID` that we have to supply using the query option
`variables` as before. However, other than with the trainer name variable, we cannot just use a value as the
id in our case. For that reason, we have the possibility to access the props of `PokemonDetailWithData` when creating
the `variables` object.

So, we can replace:

```js
export PokemonDetail;
```

with:

```js
export const PokemonDetailWithData = graphql(PokemonQuery, {
  options: (ownProps) => {
    return {
      variables: {
        id: ownProps.pokemonId
      }
    }
  }
})(PokemonDetail);
```

Note that by default Apollo tries to fill any unfilled variable (for instance a varaibale called `pokemonId`) with the
same variable from ownProps, so this is valid too:


```js
const PokemonQuery = gql`
  query PokemonQuery($pokemonId: ID!) {
    Pokemon(id: $pokemonId) {
      id
      url
      name
    }
  }
`
export const PokemonDetailWithData = graphql(PokemonQuery)(PokemonDetail);
```

To confirm your environment is all correctly setup, start the app now from XDE.

You should see a list of pokemons. Click on a pokemon preview to move over to the detailed view.
Click the back button on the nav bar or the native back button on Android to go back to your pokedex.

## Recap

Nice, our pokedex starts to get some shape! We added both an overview of all our pokemons as well as a detailed view of
a single pokemon. Let's go through what we saw in this exercise again:

* **Constants as query variables** helped us getting started with advanced query features
* Using GraphQL, we can easily create **nested queries**
* Using the second argument of **exponent router actions**, we can provides the page with custom parameters
* Combining **router parameters** and **dynamic query variables**, we were able to supply different data to the same
  component to quickly control what content we want to render.
