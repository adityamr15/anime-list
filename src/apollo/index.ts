import {
    ApolloClient,
    InMemoryCache
  } from "@apollo/client";

  const client = new ApolloClient({
    uri: 'https://graphql.anilist.co/',
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    Page: {
                        keyArgs: false,
                        merge(existing = {}, incoming) {
                            return {...existing, ...incoming}
                        }
                    }
                }
            }
        }
    })
  });
  
  export default client;