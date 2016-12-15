# Excursion 02 - Managing Apollo store

Apart from executing queries and mutations, Apollo Client takes care of caching query and mutation results in a client-side store. Let's explore the caching mechanisms encountered in Apollo Client and its React integration.

## Default caching behaviour

With the correct setup, different components that need the same data don't store this data separately, but both link to the same data in the client-side store mostly managed by Apollo.

Per default, data is identified by its query path. In our pokedex example, this is the path for the pokemon nodes of our Trainer:

> RootQuery - Trainer(name: `__NAME__`) - ownedPokemons

However, there might be multiple queries to fetch the same pokemon nodes. For example, this is an alternate path to the pokemons in our server:

> RootQuery - allPokemons

Additionally, Apollo has no default way of knowing how mutations affect data. So, if we run an `updatePokemon` mutation on a specific pokemon node, the mutation might not result in the update of the stored data.

## Data normalization

To tackle this problem, we can help out Apollo Client by specifying the `dataIdFromObject` method on the Apollo Client instance to define how a node should be identified. In our case, every node has a unique `id` that we can use in this case:

```js
const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__'}),
  dataIdFromObject: o => o.id
})
```

We have to make sure to include the `id` field in every query and mutation result. This will lead to a normalized cache and query paths won't be used for caching purposes anymore.

While specifying `dataIdFromObject` like that helps when working with queries and updating nodes, we have to do a bit more to make caching consistent in combination with creating or deleting nodes.

## Cache consistency when creating or deleting nodes

Let's focus on creating nodes. A consistent UI for deleting nodes can be handled similar.
Our `createPokemon` mutation looks like this:


```js
const createPokemonMutation = gql`
  mutation createPokemon($name: String!, $url: String!, $trainerId: ID) {
    createPokemon(name: $name, url: $url, trainerId: $trainerId) {
      id
    }
  }
`
```

When we run it, the pokedex is not updated without refreshing. Why isn't the `id` field enough in this case? Well, Apollo Client doesn't know that we just created a new node to the `ownedPokemons` edge on the `Trainer` query. It only sees the new `id` in the mutation result and adds a new node to the root of the cache. However, there is no information that links it to our specific `Trainer` query and so the pokedex cannot be updated. We can work around that issue by including the `trainer` node in the mutation result:

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

What we do here is to query all the pokemons our trainer owns whenever we create a new one. Apollo Client matches the trainer from our `TrainerQuery` in `Pokedex` with the `trainer` node in this mutation results, sees that `ownedPokemons` got an additional node, and updates the pokedex accordingly. Even though this creates a consistent UI, it is highly inefficient. Imagine the trainer already have dozens of pokemons, then we would query a lot of data that we already cached before, defeating the purpose of caching.

There is a more efficient way that leverages the `reducer` concept from Redux. When specifying a query or mutation, you can use `updateQueries` to define how the local store should be updated with the incoming query or mutation result.

In our case, we want to update the `Trainer` query:

```js
const AddPokemonCardWithMutation = graphql(createPokemonMutation, {
  props({ ownProps, mutate }) {
    return {
      createPokemon({ variables }) {
        return mutate({
          variables: { ...variables },
          updateQueries: {
            Trainer: (prev, { mutationResult }) => {
              const newPokemon = mutationResult.data.createPokemon
              return update(prev, {
                ownedPokemons: {
                  $push: [newPokemon],
                },
              })
            },
          },
        })
      },
    }
  },
})(withRouter(AddPokemonCard))
```

## Consistent UI without caching

Depending on your use case, you might be fine with a solution that offers a consistent UI without using caching at all. You could use different techniques, like [refetching](http://dev.apollodata.com/react/receiving-updates.html#Refetch) or  [polling](http://dev.apollodata.com/react/receiving-updates.html#Polling) to accomplish that.

In other cases, you want to make sure to query data from the server, even though some data required for your query might already be in your cache. You can do this by using the [forceFetch](http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient.watchQuery) option. The cache is still updated with results of forced query.

## Further resources

* http://dev.apollodata.com/core/how-it-works.html
* https://dev-blog.apollodata.com/the-concepts-of-graphql-bc68bd819be3
* http://dev.apollodata.com/react/cache-updates.html
