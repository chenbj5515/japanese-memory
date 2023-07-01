import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { Provider } from "react-redux";
import "remixicon/fonts/remixicon.css";
import store from '@/store'

const authLink = new ApolloLink((operation, forward) => {
  // 将访问令牌添加到请求头
  operation.setContext({
    headers: {
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_TOKEN,
    },
  });

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(
    new HttpLink({ uri: "http://35.239.19.68:8080/v1/graphql" })
  ),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  );
}
