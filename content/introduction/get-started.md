# Introduction

Welcome to *Learn Apollo*, a hands-on tutorial for Apollo Client where you take a journey from a basic starter-kit application to a complete pokedex application!

<iframe width="560" height="315" src="https://www.youtube.com/embed/UNoHVLrItXQ?list=PLn2e1F9Rfr6neWxkWtlTAwshh07-m1p5I" frameborder="0" allowfullscreen></iframe>

## Goals

* Understand what Apollo Client handles for you
* Learn how to build a realistic Apollo Client application from start to finish in an interactive and fun way
* Expand your understanding on different concepts through separate excursions
* Access further resources and be able to enrich the community

## The tutorial structure

We offer different so called *tutorial tracks* to work on the Pokedex application. Choose between tracks like React, React Native Vanilla and
React Native Exponent. More tracks, such as for Angular 2, iOS and Vue.js are planned. You can choose whatever you feel most comfortable with or try out something new. Each exercise builds upon the previous one and features individual steps to finish it. And if you're not sure how to best approach a task, just take a sneak peek at the solution folder or drop by at our [Slack channel](http://slack.graph.cool)!

Exercises and solutions are available in separate folders in the provided zip file so you can easily switch
between and compare different exercises and solutions.

Apart from the self-contained Apollo tutorial, we offer excursions that will zoom in on selected
topics such as *the Redux DevTools* or *Caching with Apollo Client*. The excursions are not necessary to finish the exercises, but
can teach you a trick or two or give you a better understanding of specific concepts.

## The pokedex application

![](../images/react-pokedex.png)

We will build a pokedex application where you are able to view the list of all the pokemons you own, view the details of a specific pokemon
and create new pokemons or delete or update existing pokemons. We prepared a [hosted demo of the application](http://demo.learnapollo.com), go check it out!

Before you are ready with working on the pokedex application, we have to set you up with the necessary tools.

## Environment setup

You need these tools to get started:

* [Node](https://nodejs.org)
* a Node package manager like [yarn](https://yarnpkg.com/en/docs/install)
or [npm](https://www.npmjs.com/)

Usually, you need to set up a GraphQL server on your own if you want to use GraphQL clients like Apollo Client. However, this tutorial provides you with your individual GraphQL server hosted by [Graphcool](http://graph.cool). This means you can dive right into the action, without spending hours on building a backend first.

<!-- __INJECT_GRAPHQL_ENDPOINT__ -->
