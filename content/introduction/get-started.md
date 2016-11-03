<iframe height="315" src="https://www.youtube.com/embed/rzGkGQi3ZiM" frameborder="0" allowfullscreen></iframe>

# Get started

In this chapter, we will set up our awesome Pokedex app. The first thing we need to do is to configure our environment, tools, and GraphQL endpoint. We will also see a guideline to follow along with this tutorial.

## Environment setup

In order to code along with the examples in this tutorial, here is the list of technologies that you need to install beforehand. If you have not installed them yet, just follow the links provided below which will take you to the relevant installation guide:

#### [Git](https://git-scm.com/downloads)

Git is a distributed version control system that developers use to track and share code. We will use the branch system provided by Git to follow each step in the tutorial and we will see how to use it in the [How to follow along with this tutorial?](#how-to-follow-along-with-this-tutorial) section.

#### [yarn](https://yarnpkg.com/en/docs/install)

Yarn is yet another resource manager for node.

#### [Node v6.0+ and NPM](https://nodejs.org/en)

Node is a server-side platform built on top of [V8](https://developers.google.com/v8), we will use it to run our [Express](https://expressjs.com/) server using the [Webpack dev server](https://webpack.github.io/docs/webpack-dev-server.html). NPM is short for Node Package Manager which is used to handle the project's dependencies.

### Tools
There are many tools built by people from the open-source community that make developing applications with Apollo easier.

#### Editor integration (Optional)

Most of the time, we need to work with `Relay.QL` which is a normal template string. It doesn't support syntax highlighting, code-formatting or auto-completion out of the box. Luckily, there are some brilliant editor plug-ins providing these features.
- [js-graphql-intellij-plugin](https://github.com/jimkyndemeyer/js-graphql-intellij-plugin) - GraphQL language support for IntelliJ IDEA and WebStorm, including Relay.QL tagged templates in JavaScript and TypeScript
- [language-graphql](https://github.com/rmosolgo/language-graphql) - GraphQL support for Atom text editor

## Making the most of this tutorial

* React/Angular 2/React-Native track
* hands-on; convey concepts by doing them
* excursion: learn some new tricks or get a better understanding in fundamentals

## GraphQL Endpoint

Normally, Apollo requires you to set up a GraphQL server on your own. However, for the sake of convenience, we already prepared the GraphQL server and set it up properly for you! This means you can start working on the Pokedex app without worrying about configuring your own GraphQL server.

<!-- __INJECT_GRAPHQL_ENDPOINT__ -->
