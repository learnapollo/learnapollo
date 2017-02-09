# Tutorial 04 - Fragments

Welcome to the 4th exercise in the **iOS Track** of this Apollo Client Tutorial!


## Goal

In this exercise, our **goal** is to display a _detail view_ for a Pokemon when the user selects it in the table view. Therefore, we are going to learn about a new GraphQL feature that allow to reuse sub-parts of a query: Fragments! 


## Introduction

Open the directory that contains the 4th exercise (`exercise-04`) and open `pokedex-apollo.xcworkspace`. It already contains a running version of the code you wrote in the previous lesson, however we made a few minor changes: We "untangled" the information about the trainer and now, rather than storing one property `trainer` of type `TrainerQuery.Data.Trainer` in `PokedexTableViewController`, we now store three individual properties which are the trainer's `id`, `name` and `ownedPokemons`. All parts of the code where `trainer` was used before have been updated accordingly.

We also added a new view controller called `PokemonDetailViewController` that is shown when a Pokemon in the table view is tapped. This view controller currently is empty when it's shown, so we need to make sure that it displays the correct data.


## Fragments

In this lesson, we are going to learn about _fragments_. Fragments are a GraphQL feature that allow to define and reuse _sub-parts_ of a query independently. With Swift's strong type system, they're actually quite an essential tool in using the **Apollo iOS client** whereas in JavaScript they're more of a convenience to save typing and improve structuring of your GraphQL queries.


## Using Fragments To Decouple Data Requirements

### Why Are Fragments Useful?

With the new `PokemonDetailViewController` we now have have two differents areas in our app where we need to access a Pokemon's `name` and `url` (the `PokemonCell` is the second one). Currently, the only way for us to do so is by using the generated struct `TrainerQuery.Data.Trainer.OwnedPokemon` in both places. However, with this approach we are coupling the data requirements of the `PokemonCell` very tightly to the ones of our `PokemonDetailViewController`. This might turn out very inconvenient when our data requirements change in the future and suddenly one area should include more, less or complemetely different data. Fragments enable independent usage of the same data in various locations, which decouples the data requirements of different views and greatly improves our flexibility!


### Defining A Fragment

Fragments are defined on a specific _type_ from our GraphQL schema and can then be inserted into queries to represent the data that they contain. We are going to define the fragment on the `Pokemon` type, as this is the type that contains the information that we want to use in multiple locations.

This is what the definition of a fragment looks like:

```graphql@PokedexTableViewController.graphql
fragment PokemonDetails on Pokemon {
  id
  name
  url
}
```

The definition of a fragment begins with the keyword `fragment`. Then follows the name of the fragment (in our case that is `PokemonDetails`) and the GraphQL type on which we define the fragment, so here this is `Pokemon`.

The next question is, where exactly should we define this fragment? The data that is represented by this fragment will be used in multiple locations:
- `PokemonCell`
- `PokedexTableViewController`
- `PokemonDetailViewController`

As it is used all over the place, let's just go and add it to the `PokedexTableViewController.graphql` which is also responsible for initially fetching it. We could also create a new `.graphql` file and put the fragment in there - remember that all `.graphql` will be merged by `apollo-codegen`. So, no matter where we define the fragment, it will be available in all other queries and mutations.

So, go ahead and copy the fragment above into `PokedexTableViewController.graphql`.


### Using A Fragment

As mentioned before, a fragment only defines a sub-part of a proper GraphQL query or mutation. This means that we can simply replace the properties contained in the query/mutation with the fragment itself. In our case, this would look like this:

Our `TrainerQuery` will be changed to:

```graphql@PokedexTableViewController.graphql
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

After incorporating these changes, build the project by hitting `CMD + B` and inspect `API.swift`. Also notice that the compiler will now throw a few errors that we will fix in a second.

In `API.swift`, you'll see that `apollo-codegen` now generated an additional top-level struct called `PokemonDetails` that represents our newly defined fragment. Further, our struct from before `TrainerQuery.Data.Trainer.OwnedPokemon` now received a new property of type `Fragments` that carries the information from our fragment.

Great, we just made our data model a lot more flexible! Let's now go and make the required changes in our code to see how we can use the newly gained flexibility to display the Pokemon data in `PokemonDetailViewController`.

First, let's fix the compiler errors: Open `PokemonCell.swift` and change the type of the `ownedPokemon` property to our new fragment based type: `PokemonDetails`.

```swift@PokemonCell.swift 
var ownedPokemon: PokemonDetails? {
    didSet {
        updateUI()
    }
}
``` 

Next, open `PokedexTableViewController.swift` and change the type of `ownedPokemons` to `[PokemonDetails]?`:

```swift@PokedexTableViewController.swift
var ownedPokemons: [PokemonDetails]? = [] {
    didSet {
        tableView.reloadSections([Sections.pokemons.rawValue], with: .none)
    }
}
```

Finally, we need to update the assignment of `ownedPokemons` in `setTrainerData(trainer: TrainerQuery.Data.Trainer)`:

```swift@PokedexTableViewController.swift
func setTrainerData(trainer: TrainerQuery.Data.Trainer) {
    self.trainerId = trainer.id
    self.trainerName = trainer.name
    self.ownedPokemons = trainer.ownedPokemons.map { $0.fragments.pokemonDetails }
```

Now, the compiler is happy and the app should build and run normally again.


## Implementing The `PokemonDetailViewController`

As a last step in this lesson, you are going to implement the functionality for the `PokemonDetailViewController` that was already added to the project and that is currently empty if you navigate to it from a table view cell.

This step will be pretty easy thanks to the fragment that we defined. First, go ahead and add the following property to the `PokemonDetailViewController`:

```swift@PokemonDetailViewController.swift
var pokemonDetails: PokemonDetails!
```

Next, we are going to use a similar approach for setting the UI as in `PokemonCell`, add the following method to `PokemonDetailViewController`:

```swift@PokemonDetailViewController.swift
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

Now add a call to `updateUI()` as the last line in `viewDidLoad()`, so that it looks as follows:

```swift@PokemonDetailViewController.swift
override func viewDidLoad() {
  super.viewDidLoad()
  title = "Details"
  updateUI()
}
```

Since we don't actually set the `pokemonDetails` property yet, but try to access it, the app will crash if you test this feature now. This is because the property is declared as an implicitly unwrapped optional!

So, let's quickly go and implement the last required step, which is assigning the `pokemonDetails` property in `prepare(for segue: UIStoryboardSegue, sender: Any?)` in the `PokedexTableViewController`. Therefore, add the following code in `prepare(for segue: UIStoryboardSegue, sender: Any?)`:

```swift@PokedexTableViewController.swift
if segue.identifier == "ShowPokemonDetailsSegue" {
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
- They can be reused in multiple queries and mutations
- `apollo-codegen` generates one struct per fragment which allows to reuse similar information that originates from different queries or mutations





