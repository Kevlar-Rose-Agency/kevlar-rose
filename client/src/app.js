/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Colors
} from 'react-native';

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHttpLink } from 'apollo-link-http';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import ReduxLink from 'apollo-link-redux';
import { onError } from 'apollo-link-error';

import AppWithNavigationState, {
  navigationReducer,
  navigationMiddleware,
} from './navigation';

const URL = 'localhost:8080'; // set your comp's url here
const store = createStore(
  combineReducers({
    apollo: apolloReducer,
    nav: navigationReducer
  }),
  {}, // initial state
  composeWithDevTools(
      applyMiddleware(navigationMiddleware),
      ),
);

const cache = new ReduxCache({ store });
const reduxLink = new ReduxLink(store);
const errorLink = onError((errors) => {
  console.log(errors);
});
const httpLink = createHttpLink({ uri: `http://${URL}` });
const link = ApolloLink.from([
  reduxLink,
  errorLink,
  httpLink,
]);

export const client = new ApolloClient({
  link,
  cache,
});

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 0,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
           <Provider store={store}>
            <AppWithNavigationState />
           </Provider>
         </ApolloProvider>
    );
  }
}
