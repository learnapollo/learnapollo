# Tutorial 05 - Basic Mutations

Welcome to the 5th exercise in the **iOS Track** of this Apollo Client Tutorial!


## Goal

In this exercise, our **goal** is to add new Pokemons to the Pokedex. Therefore, we are going to learn about _mutations_.


## Introduction

Open the directory that contains the 5th exercise (`exercise-0`) and open `pokedex-apollo.xcworkspace`. 

It already contains a running version of the code you wrote in the previous lesson.
We again added a new view controller called `CreatePokemonViewController` that will allow us to enter data for a new Pokemon in our Pokedex. When segueing from the `PokedexTableViewController` to the `CreatePokemonViewController` we are passing the trainer's ID, so that we can send this information along to the server to associate the trainer with the new Pokemon.


## Using _Mutations_ To Add New Pokemons

### Mutations In GraphQL

So far, we only learned about _queries_, a GraphQL concept that allows us to _fetch_ data from an API. However, in most applications we actually also want to be able to change the data in the backend either by updating existing data entries or creating completely new ones. In GraphQL, this can be done via _mutations_.

Mutations are very similar to _queries_, but when defining them in our `.graphql` files, we need to use the keyword `mutation` instead of `query`. The **Apollo iOS client** will then, similar to queries, generate one class per mutation.


### Adding a New Pokemon

Let's see what a mutation for adding a new Pokemon would look like (again, wait with copying the mutation, we will create `CreatePokemonViewController.graphql` in a second):

```graphql@CreatePokemonViewController.graphql
mutation CreatePokemon($name: String, $url: String!, $trainerId: ID) {
  createPokemon(name: $name, url: $url, trainerId: $trainerId) {
    id
    name
    url
  }
}
```

> Note: Similar to queries, you can execute this mutation in [GraphiQL](https://api.graph.cool/simple/v1/__PROJECT_ID__). Don't forget to add the query variables for `$name`, `$url` and (potentially) `$trainerId`. 

The above mutation will create a new Pokemon with the provided data. Similar to a query, we can specify the return data of the request. In this case, we're asking it to return the full data for the newly created Pokemon, i.e. `id`, `name` and `url`. This is helpful as it allows us to update the UI directly using the response of our mutation!

To use this mutation in our app, create a new _empty_ file called `CreatePokemonViewController.graphql`, copy the above mutation into this new file and hit `CMD + B` to build the project, then inspect the contents of `API.swift`. 

As you can see, `apollo-codegen` once again did a great job and generated a new class for us called `CreatePokemonMutation`. Its structure is very similar to the queries, in that it has a nested struct called `CreatePokemon` with properties `id`, `name` and `url` that represents our new Pokemon.


### Using the New `CreatePokemonMutation`

Let's now go and use the mutation in our code! Open `CreatePokemonViewController.swift` and copy the following code snippet into the `addPokemon()` method right after the `guard` statement:

```swift@CreatePokemonViewController.swift 
let createPokemonMutation = CreatePokemonMutation(name: name, url: imageURL, trainerId: trainerId)
activityIndicator.startAnimating()
apollo.perform(mutation: createPokemonMutation) { [unowned self] (result: GraphQLResult?, error: Error?) in
    self.activityIndicator.stopAnimating()
    if let error = error {
        print(#function, "ERROR | An error occured while adding the new Pokemon: \(error)")
        return
    }
    guard let newPokemon = result?.data?.createPokemon else {
        print(#function, "ERROR | Could not get the new Pokemon")
        return
    }
    print("Created new pokemon: \(newPokemon)")
    self.presentingViewController?.dismiss(animated: true)
}
```

Let's take a step back again and understand what's going on. We instantiate the `CreatePokemonMutation` that was generated through `apollo-codegen`, passing the values we retrieved from the text fields as well as the trainer's ID as arguments. We then use our `ApolloClient` instance, to `perform` a mutation this time rather than `fetch`ing data based on a query. Once more, we are using Swift's trailing closure syntax to pass in a callback so that we can handle the return values of our request. In this case, if the mutation is successful, we might receive the data of the new pokemon and finally print it to the console.

Run the app and create a new Pokemon, called `Mewthree` using `Mewtwo`'s image URL: `http://cdn.bulbagarden.net/upload/thumb/7/78/150Mewtwo.png/250px-150Mewtwo.png`.  

You should see an output similar to the following in the console: 

```
Created new pokemon: CreatePokemon(__typename: "Pokemon", id: "cixm4hazlitwt01693wg9mey5", name: Optional("Mewthree"), url: Optional("http://cdn.bulbagarden.net/upload/thumb/7/78/150Mewtwo.png/250px-150Mewtwo.png"))`
```

So, we successfully added a new Pokemon to our database, you can verify this in [GraphiQL](https://api.graph.cool/simple/v1/__PROJECT_ID__). However, **the table view doesn't yet display this new Pokemon!**


## Using Apollo's Caching Feature To Update The UI

Next to the ability of generating and working with Swift types that represent your GraphQL queries and mutations, Apollo's second major feature is _caching_ data. In fact, this feature will allow us to keep our UI in an updated state without explicitly having to take care of this ourselves, meaning we don't have to update any view properties or call `tableView.reloadData()` after we performed a mutation. Magic! 🎩

If you're curios about how to the caching works, you can read more about it in the [documentation](http://dev.apollodata.com/ios/watching-queries.html). In order to take advantage of the automatic UI updates, we need to make a few changes to our current implementation of the app. 


### The `GraphQLQueryWatcher`

The most important component for the implementation of the automatic UI updates is the `GraphQLQueryWatcher`. Each instance of the `GraphQLQueryWatcher` is associated with exactly one query. In fact, the only thing we really need to do is changing the way we fire off a query, that is rather than using `fetch` on the `ApolloClient`, we call another method called `watch`. This method will then return our `GraphQLQueryWatcher` instance!

This instance will from then on _observe_ what is happening in the client-side cache. Whenever the data that was associated with the query which was used to create the `GraphQLQueryWatcher` instance changes, the watcher will call the result handler that was initially passed when firing off the query. But enough with the talking, let's go and implement it to let things become a little clearer!


### Watching A Query

Right now, we only have one query that we send to the backend. So, as mentioned above, let's use `watch` instead of fetch to fire it off and store the result in a variable of type `GraphQLQueryWatcher`!

First, let's add a property in `PokedexTableViewController` since this is where we send the query (you can add this property on top of the class, e.g. right before ` var trainerId: GraphQLId`):

```swift@PokedexTableViewController.swift 
var trainerQueryWatcher: GraphQLQueryWatcher<TrainerQuery>?
```

Next, we need to update the code in the `fetchTrainer()` method like so:

```swift@PokedexTableViewController.swift 
        let trainerQuery = TrainerQuery(name: "Nikolas")
        trainerQueryWatcher = apollo.watch(query: trainerQuery) { [unowned self] (result: GraphQLResult?, error: Error?) in
            if let error = error {
                print(#function, "ERROR | An error occured: \(error)")
                return
            }
            guard let trainer = result?.data?.trainer else {
                print(#function, "ERROR | Could not retrieve trainer")
                return
            }
            self.setTrainerData(trainer: trainer)
        }
```

Notice that the only line that changed compared with the previous implementation is the second one, where we now use the `watch` method and store the return value in our new property. One thing that is left for us to do is "cleaning up" after us when the `PokedexTableViewController` deallocates, that is we need to call `cancel` on the watcher as it would keep sticking around otherwise. We can do so by implementing `deinit` in the view controller, a method that gets called right before it deallocates:

```swift@PokedexTableViewController.swift 
    deinit {
        trainerQueryWatcher?.cancel()
    }
``` 

If you're running the app now, you'll be disappointed that the promised automatic UI updates still aren't working! That's because we still need to make two more small changes.


### Finalizing Automatic UI Updates

First, we need to implement `chacheForKeyObject` on the `ApolloClient` which we can do right after we instantiate it in the method `application(_:, didFinishLaunchingWithOptions:)` of the `AppDelegate`. Go ahead and implement the current implementation like so:

```swift@AppDelegate.swift
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        apollo.cacheKeyForObject = { $0["id"] }
        return true
    }
```

> Note: Without going into too much detail about how the `ApolloClient` implements caching, it can be said that it stores the data that it receives from the server in an instance of `ApolloStore`. However, it's important that it doesn't store the data in the same "shape" as it receives it (which is the shape of the query that was sent in the first place), but instead _normalizes_ (or _flattens_) the data, so that it ends up with a bunch of simpler objects that represent the information from the query response. It then also associates each of these objects with a unique key which allows it to refer to it later on (e.g. when it gets updated from a different query).

The second change we need to make is in the `CreatePokemon` mutation in our `CreatePokemonViewController.graphql` file. Rather than only letting the `PokemonDetails` be returned from this mutation, we explicitly ask for the `trainer` and their `ownedPokemons`! This is necessary for our `trainerQueryWatcher` to notice that the data (i.e. the `ownedPokemons`) of the trainer that it watches have changed!

Go ahead and replace the current `CreatePokemon` mutation with this new version:

```graphql@CreatePokemonViewController.graphql
mutation CreatePokemon($name: String!, $url: String!, $trainerId: ID) {
  createPokemon(name: $name, url: $url, trainerId: $trainerId) {
    ...PokemonDetails
    trainer {
      id
      ownedPokemons {
        id
      }
    }
  }
}
``` 

All right, this is it! Build and run the project, go add a new Pokemon using our `CreatePokemonViewController` and admire the table view getting updated instantly.

To quickly re-iterate, the main reason why this automatic update happens is because Apollo initially stores the `trainer` and the associated `ownedPokemons` in the `ApolloStore`. At the same time, the `trainerQueryWatcher` observes this data, so that whenever it changes, the watcher will call the closure that we specified when we initially called `watch` on the `ApolloClient` instance (in `fetchTrainer()` of  the `PokedexTableViewController`. And because the data in the `ApolloStore` is stored independently from the original query, it doesn't matter where this change is coming from!



## Recap 

In this exercise, we added functionality to our app that allows to add a new Pokemon to our Pokedex and take advantage of the caching and automatic UI updates that's implemented in the **Apollo iOS client**. Here is a summary of what we learned:

- _Mutations_ are used in GraphQL to update data in the backend
- Syntactically, they are similar to queries but use the keyword `mutation` instead of `query`
- `apollo-codegen` will generate one class per _mutation_
- The method `perform()` of `ApolloClient` can be used to actually execute a mutation in the backend
- Queries can be _observed_ using the `GraphQLQueryWatcher` allowing for automatic UI updates









