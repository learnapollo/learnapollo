# Tutorial 01 - Getting Started

Welcome to the first exercise in the **iOS** Track of this Apollo Client Tutorial! If you prefer React, React Native, Angular 2 or Vue.js over iOS, head over to the respective tutorial track.

> Note: This tutorial assumes a basic familiarity with GraphQL and focusses on usage of the `Apollo iOS Client`. If you want to learn more about the underlying GraphQL concepts, visit [learngraphql.com](www.learngraphql.com).

## Goal

The goal of this exercise is to get your environment set up to use the Apollo iOS Client. 

By the end of this exercise you will have a running Xcode project in which you can use the Apollo iOS Client. The app will display a generic greeting, telling you that you don't have any Pokemon in your Pokedex yet.


## Introduction

Sign up with GitHub to receive your own `pokedex-apollo` project here:

<!-- __DOWNLOAD_IOS__ -->

Now change to the folder that contains the first exercise (`exercise-01`) and open the `pokedex-apollo.xcworkspace`. We need to use the `.xcworkspace` because we are using Cocoapods for managing dependencies. 

As you can see, there is already one dependency included in the project. This dependency is [Alamofire](https://github.com/Alamofire/Alamofire), which we are going to use to make networking calls.

The app so far only consists of one table view controller that will display two _sections_. The first section right now only contains a generic greeting from the prototype cell in Storyboard, the second section will be used to actually display the Pokemons you catch.


## Installing the Apollo iOS Client with Cocoapods

The Apollo iOS client can be installed through Cocoapods or Carthage. Since we are using Cocoapods in this project, go ahead and open the `Podfile` and add the following line:

```ruby
pod 'Apollo'
```

After you executed this step, run `pod install` in your terminal.


## Setting up the Apollo Environment

Unlike most other dependencies that are installed with Cocoapods, we are not quite done with setting up the environment after running `pod install`. That is because the Apollo iOS client depends on an additional tool called `apollo-codegen`. With every time you build the project, this tool needs to run before the actual compilation. The reason for this is that the tool will scan your project for any `.graphql`-files and generate a Swift file called `API.swift` that represent your GraphQL types. A major advantage of this approach is that we can leverage the Swift type system to make sure we are only querying data that we need, and the compiler will catch any potential issues for us before runtime.

> Note: The [Apollo iOS Guide](http://dev.apollodata.com/ios/index.html) also contains detailled information about setup and usage of the Apollo iOS client.

### Install `apollo-codegen`

You first need to globally install `apollo-codegen` on your machine using the _node package manager_ (npm) with the following command:

```bash
npm install -g apollo-codegen
```

### Adding a build phase

Our next step is to add a _Build Phase_ to our Xcode project. Follow the instructions do so:

1. Select the **apollo-pokedex** project in the _Project Navigator_
2. Select the only application target `apollo-pokedex`
3. Select the **Build Phases** tab on top
4. Click the **+**-button on the top left
5. Select **New Run Script Phase**
  ![Add a Run Script Phase](../images/ios-ex01-build_phase1.png "Add a Run Script Phase")
6. Rename the newly added _Build Phase_ to **Generate Apollo GraphQL API**
7. Drag the _Build Phase_ right before **Compile Sources**
8. Copy the following code snippet into the field that currently says: _Type a script or drag a script file from your workspace to insert its path_
  ```bash
  APOLLO_FRAMEWORK_PATH="$(eval find $FRAMEWORK_SEARCH_PATHS -name "Apollo.framework" -maxdepth 1)"

  if [ -z "$APOLLO_FRAMEWORK_PATH" ]; then
    echo "error: Couldn't find Apollo.framework in FRAMEWORK_SEARCH_PATHS; make sure to add the framework to your project."
    exit 1
  fi

  cd "${SRCROOT}/${TARGET_NAME}"
  $APOLLO_FRAMEWORK_PATH/check-and-run-apollo-codegen.sh generate $(find . -name '*.graphql') --schema schema.json --output API.swift
  ```
9. This code will now run `apollo-codegen` before compilation and generate a file called `API.swift`. Verify your settings look like this:
  ![Final setup should look like this](../images/ios-ex01-build_phase2.png "Final setup should look like this")

> From the [Apollo iOS Guide](http://dev.apollodata.com/ios/installation.html): _The script above will invoke `apollo-codegen` through the `check-and-run-apollo-codegen.sh` wrapper script, which is actually contained in the `Apollo.framework` bundle. The main reason for this is to check whether the version of `apollo-codegen` installed on your system is compatible with the framework version installed in your project, and to warn you if it isn’t. Without this check, you could end up generating code that is incompatible with the runtime code contained in the framework._

If you already built the project and wonder why we're not yet seeing the promised `API.swift`-file, this is actually just because we haven't included any `.graphql`-files yet, so there is nothing to generate. We are going to do this in the next lesson.


## Instantiate the Apollo Client

Next, we want to instantiate the Apollo client so that we can start making requests against our GraphQL API. For the purpose of this tutorial, we will create a global instance of the client in `AppDelegate.swift`. Therefore, we first need to import the Apollo framework using `import Apollo` (which you can add directly below `import UIKit`).

Then add the following two lines after the import statements:

```swift
let graphlQLEndpointURL = "https://api.graph.cool/simple/v1/__PROJECT_ID__"
let apollo = ApolloClient(url: URL(string: graphlQLEndpointURL)!)
```

Make sure you use the correct URL that represents your Pokedex sandbox. If you signed in via GitHub, the URL should have been set for you automcatically. 

The `ApolloClient` we instantiated above can now be used for mainly two different things:
- fetching data using _queries_, it exposes the method `fetch` for that
- updating data using _mutations_, it exposes the method `perform` for that

That's it for this lesson! Make sure everything is set up properly until this point by running the project in a simulator. 

![You should see this screen when running the app](../images/ios-ex01-final.png "You should see this screen when running the app")


## Recap

In this lesson, we learned how to configure the environment and set up the Apollo iOS client:

- The Apollo iOS client can be installed via Cocoapods or Carthage
- Its usage however requires some further configuration: 
  - Adding a build phase to invoke `apollo-codegen`
  - Having the `schema.json`-file available in your project




