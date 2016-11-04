<iframe height="315" src="https://www.youtube.com/embed/rzGkGQi3ZiM" frameborder="0" allowfullscreen></iframe>

# Get started

In this chapter, we will set up our awesome Pokedex app. The first thing we need to do is to configure our environment, tools, and GraphQL endpoint. We will also see a guideline to follow along with this tutorial.

## Tools
There are many tools built by people from the open-source community that make developing applications with Apollo easier.

### [yarn](https://yarnpkg.com/en/docs/install)

Yarn is yet another resource manager for Node.

### Editor integration (Optional)

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
