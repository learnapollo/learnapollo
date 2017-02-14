# Tutorial 01 - Getting Started

Welcome to the first exercise in the **React Native Exponent Track** of this Apollo Client Tutorial!
If you prefer React or React Native Vanilla over React Native Exponent, head over to the respective tutorial track.

## Goal

The **goal** of this first exercise is to install a React Native App and run it afterwards.
You will get familiar with the infrastructure surrounding Apollo Client for React Native and with the App structure of the Pokedex.

## Prerequisites

This tutorial uses [ExponentJS](https://getexponent.com/).
ExponentJS is a mobile app development tool for React Native with an included SKD for system functionality and also provides UI components

## Introduction

Sign up with GitHub to receive your own `pokedex-react-native-exponent` here:

<!-- __DOWNLOAD_RNEXPONENT__ -->

Now change to the first exercise and install the dependencies from your console:

```sh
cd pokedex-react-native-exponent/exercise-01-initial
yarn install # or npm install
```

## Getting familiar with the app

Let's take a moment to get more familiar with the structure of the app before we run it.

* `./assets` - custom fonts or images
* `./components` - commonly needed React components like `BaseText` for text components with a custom font
* `./constants` - color and layout constants for style consistency
* `./navigation` - router and tab navigation
* `./screens` - screens and associated components
* `./state` - configuration of Redux store
* `./utilities` - utilities
* `./exp.json` - configuration of exponent project
* `./main.js` - root file of the project

## Exercise

### Package Dependencies

Install two packages:

* `apollo-client` - the core package exposes the vanilla JS Apollo Client which provides the core functionality
* `react-apollo` - the React integration exposes the `ApolloProvider` that can be used to wrap other React components,
  allowing them to send queries and mutations

```sh
yarn add apollo-client react-apollo
```

### Add a Apollo Client

Create a new file in `./state/Apollo.js` with the following content.

```js@./state/Apollo.js
import ApolloClient, { createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__'}),
});

export default client;
```

If you signed up with GitHub and downloaded the example, we already took care of this step for the following exercises.

This client will perform the API calls and manage the cache.

### Modifying the Redux store

In order to connect Apollo Client to the existing store, modify `./state/Store.js`:

```js@./state/Store.js
// ...
import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import client from 'learnapollo/state/Apollo.js';

// ...
const store = createStoreWithNavigation(
  combineReducers({
    // ...,
    apollo: client.reducer()
  }),
  compose(
    applyMiddleware(client.middleware()),
  )
);

// ...
```

This integrates Redux and Apollo Client so that Redux can intercept queries made with Apollo Client, while Apollo Client can write to application wide Redux store.

### Add the Provider

To allow our React components to issue GraphQL queries and mutations through the client, we wrap them
with the `ApolloProvider` component from the `react-apollo` package.

This package is analogous to the React integration of Redux, `react-redux`.

To do this, modify the `./main.js` to wrap the NavigationProvider inside ApolloProvider.

```js@./main.js
import { ApolloProvider } from 'react-apollo';
import Store from 'learnapollo/state/Store';
import Client from 'learnapollo/state/Apollo';

// ...
class AppContainer extends Component {
  render() {
    // ...
    return (
      // ...
      <ApolloProvider store={Store} client={Client}>
        <NavigationProvider router={navigationContext}>
          <StackNavigation
            id="root"
            initialRoute={initialRoute}
          />
        </NavigationProvider>
      </ApolloProvider>
      // ...
    )
    // ...
  }
}
```

> Note: You don't have to put `ApolloProvider` on the highest level of the component hierarchy - however,
  every component that wants to use Apollo Client needs to be a direct or indirect children
  of `ApolloProvider` in the component hierarchy.

Our Home component lives in `screen/Home.js`. Currently, it only contains a generic title, but that will change soon!
We will further expand this component in the following exercises to give an overview about all the pokemon in your
Pokedex as well as the possibility to add new pokemons or update existing ones.

But for now, let's make sure you are ready to go.

## Starting the App

To confirm your environment is all correctly setup, start the app now from XDE:

![](../images/xde.png)

Click on `Device` to start the iOS or Android Simulator.

## Recap

Great, you did it!
You successfully ran the React Native App with Exponent and got familiar with its general structure.
Let's quickly summarize what we learned so far:

* To use the **Apollo Client**, we need to import it from `apollo-client` and setup its **networkInterface**
* We can **issue queries and mutations** in our React components by wrapping them in the **Apollo Provider**
  found in `react-apollo`
* We will use the **Home component** to list our pokemons and to offer other features
