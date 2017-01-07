# Tutorial 04 - Fragments

Welcome to the fifth exercise in the **iOS Track** of this Apollo Client Tutorial!


## Goal

The **goal** of this exercise is to update our table view instantly after adding new Pokemon to the Pokedex. We also want to create a _detail view_ for the Pokemon in our Pokedex. Therefore, we are going to use another GraphQL feature called _fragments_. 


## Introduction

Open the directory that contains the fifth exercise `exercise-05` and open `pokedex-apollo.xcworkspace`. It already contains a running version of the code you wrote in the previous lesson. Note that we added another view controller called `PokemonDetailViewController` that is shown when a Pokemon in the table view is tapped. We will deal with this in the last part of this lesson after making sure the table view updates after adding a new Pokemon.


## Fragments

In this lesson, we are going to learn about _fragments_. Fragments are a GraphQL feature that allow to define and reuse _sub-parts_ of a query independently. With Swift's strong type system, they're actually quite an essential tool in using the **Apollo iOS client** whereas in JavaScript they're more of a convenience to save typing and improve structuring of your GraphQL queries.


## Using Fragments to Update the Pokedex UI

### Defining a Fragment

Fragments are defined on a specific _type_ from our GraphQL schema. We are going to define the fragment on the `Pokemon` type, as we had the problem that our types `TrainerQuery.Data.Trainer.OwnedPokemon` and `CreatePokemonMutation.Data.CreatePokemon` didn't match up despite the fact that they carry the same information.

So, let's go and solve this by defining a reusable fragment that we can inject into the query and into the mutation so that `apollo-codegen` generates a type for that fragment that we can then use in multiple locations.

We will need the fragment on the `Pokemon` type, its definition looks as follows:

```graphql
fragment PokemonDetails on Pokemon {
  id
  name
  url
}

The definition of a fragment begins with the keyword `fragment`. Then follows the name of the fragment (in our case that is `PokemonDetails`) and the GraphQL type on which we define the fragment, so here this is `Pokemon`.

The next question is, where exactly should we define this fragment? The data that is represented by this fragment will be used in multiple locations:
- `PokemonCell`
- `PokedexTableViewController`
- `CreatePokemonViewController`
- `PokemonDetailViewController`

As it is used all over the place, let's just go and add it to the `PokedexTableViewController` that is also responsible for initially fetching it. We might also create a new `.graphql` file and put the fragment in there - remember that all `.graphql` will be merged by `apollo-codegen`, so no matter where we define the fragment, it will be available in all other queries and mutations.

So, go ahead and copy the fragment above into `PokedexTableViewController.graphql`.


### Using a Fragment

As mentioned before, a fragment only defines a sub-part of a proper GraphQL query or mutation. This means that we can simply replace the properties contained in the fragment with the fragment itself. In our case, this would look like this:

Our `TrainerQuery` will be changed to:

```graphql
query Trainer($name: String!) {
    Trainer(name: $name) {
        id
        name
        ownedPokemons {
            ... PokemonDetails
        }
    }
}
```

The `CreatePokemonMutation` gets changed to the following:

```graphql
mutation CreatePokemon($name: String!, $url: String!, $trainerId: ID) {
    createPokemon(name: $name, url: $url, trainerId: $trainerId) {
        ... PokemonDetails
    }
}
```

Build the project by hitting `CMD + B` and inspect `API.swift`. Also notice that the compiler will now throw a few errors that we will fix in a second.

In `API.swift`, you'll see that `apollo-codegen` now generated an additional top-level struct called `PokemonDetails` that represents our newly defined fragment. Further, our two structs from before `TrainerQuery.Data.Trainer.OwnedPokemon` and `CreatePokemonMutation.Data.CreatePokemon` now received a new property of type `Fragments` that carries the information from our fragment.

Great, we just made our data model a lot more flexible! Let's now go and make the required changes in our code to see how we can use the newly gained flexibility in order to instantly update the UI after a new Pokemon was added to the Pokedex.

First, let's fix the compiler errors: Open `PokemonCell.swift` and change the type of the `ownedPokemon` property to our new fragment based type: `PokemonDetails`.

```swift
var ownedPokemon: PokemonDetails? {
    didSet {
        updateUI()
    }
}
``` 

Next, open `PokedexTableViewController.swift` and change the type of `ownedPokemons` to `[PokemonDetails]?`:

```swift
var ownedPokemons: [PokemonDetails]? = [] {
    didSet {
        tableView.reloadSections([Sections.pokemons.rawValue], with: .none)
    }
}
```

Finally, we need to update the assignment of `ownedPokemons` in `setTrainerData(trainer: TrainerQuery.Data.Trainer)`:

```swift
func setTrainerData(trainer: TrainerQuery.Data.Trainer) {
    self.trainerId = trainer.id
    self.trainerName = trainer.name
    self.ownedPokemons = trainer.ownedPokemons?.map { $0.fragments.pokemonDetails }
}
```

Now, the compiler is happy and the app should build and run normally again.


### Updating the UI After Adding a Pokemon

Finally, we can take care of updating the table view after adding a new Pokemon to our Pokedex. This is now possible because the Pokemon data which is received in `CreatePokemonViewController` after performing our mutation and which represents the newly added Pokemon has the same type as the Pokemons in the table view. This allows us to simply append it to the array in `PokedexTableViewController`. Let's do this with a simple closure that passes the data from `CreatePokemonViewController` to `PokedexTableViewController`, add the following property to `CreatePokemonViewController` right after the `trainerId` property:

```swift
var addedNewPokemon: ((PokemonDetails) -> ())?
```

Now, update the callback we are passing to the `perform` call on `apollo` to look as follows:

```swift
apollo.perform(mutation: createPokemonMutation) { [unowned self] (result: GraphQLResult?, error: Error?) in
    self.activityIndicator.stopAnimating()
    if let error = error {
        print(#function, "ERROR | An error occured while adding the new Pokemon: \(error)")
        return
    }
    guard let newPokemon = result?.data?.createPokemon?.fragments.pokemonDetails else {
        print(#function, "ERROR | Could not get the new Pokemon")
        return
    }
    self.addedNewPokemon?(newPokemon)
    self.presentingViewController?.dismiss(animated: true)
}
```

Note that we are using the closure you just added as a property and pass the newly created Pokemon as an argument, so the last step now will be to define the closure inside `PokedexTableViewController` and append the new Pokemon to our array.

Open `PokedexTableViewController.swift` and update `prepare(for segue: UIStoryboardSegue, sender: Any?)` to look like this:

```swift
override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    if segue.identifier == "CreateNewPokemonSegue" {
        let createPokemonViewController = segue.destination as! CreatePokemonViewController
        createPokemonViewController.trainerId = trainerId
        createPokemonViewController.addedNewPokemon = { [unowned self] in self.ownedPokemons?.append($0) }
    }
}
```

Fantastic, you can now go ahead and add as many Pokemons as you like and the changes will be instantly reflected in your Pokedex without having to restart the app! 

## Implementing the `PokemonDetailViewController`

As a last step in this lesson, you are going to implement the functionality for the `PokemonDetailViewController` that we already added to the project and that was just empty until this if you navigated to it from a table view cell.

This step will be pretty easy thanks to the fragment that we defined. First, go ahead and add the following property to the `PokemonDetailViewController`:

```swift
var pokemonDetails: PokemonDetails!
```

Next, we are going to use a similar approach for setting the UI as in `PokemonCell`, add the following method to `PokemonDetailViewController`:

```swift
func updateUI() {
    nameTextField.text = pokemonDetails.name
    imageURLTextField.text = pokemonDetails.url
    if let pokemonURL = pokemonDetails.url {
        Alamofire.request(pokemonURL).responseImage { [unowned self] response in
            if let image = response.result.value {
                self.pokemonImageView.image = image
            }
        }
    }
}
```

> Note: In a production application, you would of course want to cache the image after displaying it on the table view cells (unless it maybe were only a thumbnail version) and pass it to the `PokemonDetailViewController` rather than reloading it every time from the network.

Now add a call to `updateUI()` as the last line in `viewDidLoad()`. Since we don't actually set the `pokemonDetails` property, which is declared as an implicitly unwrapped optional, yet, but try to access it, the app will crash if you test this feature now.

So, let's quickly go and implement the last step, which is assigning the property in `prepare(for segue: UIStoryboardSegue, sender: Any?)` in the `PokedexTableViewController`. Therefore, add the following code right after the first if-statement in `prepare(for segue: UIStoryboardSegue, sender: Any?)`:

```swift
else if segue.identifier == "ShowPokemonDetailsSegue" {
    let pokemonDetailViewController = segue.destination as! PokemonDetailViewController
    let selectedRow = tableView.indexPathForSelectedRow!.row
    pokemonDetailViewController.pokemonDetails = ownedPokemons?[selectedRow]
}
```

Run the app and tap on a Pokemon in your Pokedex, the `PokemonDetailViewController` should now display the image, name and url of the Pokemon you selected.

In the next exercise, we are going to learn about more mutations that allow us to update and delete data entries.


## Recap

In this lesson, we learned about using fragments and why they are essential for using the **Apollo iOS client**. Let's revisit the key learning of this exercise:
- Fragments are a GraphQL feature that define sub-parts of a query
- They can be reused in multiple queries
- `apollo-codegen` generates one type per fragment which allows to reuse similar information that originates from different queries or mutations





