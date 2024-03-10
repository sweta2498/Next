export const getStaticProps = wrapper.getStaticProps(store => ({preview}) => {
  console.log('2. Page.getStaticProps uses the store to dispatch things');
  store.dispatch({
    type: 'TICK',
    payload: 'was set in other page ' + preview,
  });
});

// you can also use `connect()` instead of hooks
const Page = () => {
  const {tick} = useSelector(state => state);
  return <div>{tick}</div>;
};

export default Page;


fist setp 1
import {Provider} from 'react-redux';
import {wrapper} from '../components/store';

const MyApp: FC<AppProps> = ({Component, ...rest}) => {
  const {store, props} = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Component {...props.pageProps} />
    </Provider>
  );
};

two step 2

class MyApp extends React.Component<AppProps> {
  render() {
    const {Component, pageProps} = this.props;
    return <Component {...pageProps} />;
  }
}

export default wrapper.withRedux(MyApp);

three step 3

import {HYDRATE} from 'next-redux-wrapper';
const reducer = (state = {tick: 'init'}, action) => {
  switch (action.type) {
    case HYDRATE:
      const stateDiff = diff(state, action.payload) as any;
      const wasBumpedOnClient = stateDiff?.page?.[0]?.endsWith('X'); // or any other criteria
      return {
        ...state,
        ...action.payload,
        page: wasBumpedOnClient ? state.page : action.payload.page, // keep existing state or use hydrated
      };
    case 'TICK':
      return {...state, tick: action.payload};
    default:
      return state;
  }
};

setp 4 

=>The createWrapper function accepts makeStore as its first argument.

=>The makeStore function should return a new Redux Store instance each time it's called.

createWrapper also optionally accepts a config object as a second parameter:

When makeStore is invoked it is provided with a Next.js context, which could be NextPageContext or AppContext or getStaticProps or getServerSideProps context depending on which lifecycle function you will wrap.

Some of those contexts (getServerSideProps always, and NextPageContext, AppContext sometimes if page is rendered on server) can have request and response related properties:
Although it is possible to create server or client specific logic in both makeStore, I highly recommend that they do not have different behavior. This may cause errors and checksum mismatches which in turn will ruin the whole purpose of server rendering.

 
setp 5
This section describes how to attach to getServerSideProps lifecycle function.

Let's create a page in pages/pageName.tsx:

import React from 'react';
import {connect} from 'react-redux';
import {wrapper} from '../store';

export const getServerSideProps = wrapper.getServerSideProps(store => ({req, res, ...etc}) => {
  console.log('2. Page.getServerSideProps uses the store to dispatch things');
  store.dispatch({type: 'TICK', payload: 'was set in other page'});
});

// Page itself is not connected to Redux Store, it has to render Provider to allow child components to connect to Redux Store
const Page = ({tick}) => <div>{tick}</div>;

// you can also use Redux `useSelector` and other hooks instead of `connect()`
export default connect(state => state)(Page);

⚠️ Each time when pages that have getServerSideProps are opened by user the HYDRATE action will be dispatched. The payload of this action will contain the state at the moment of server side rendering, it will not have client state, so your reducer must merge it with existing client state properly. More about this in Server and Client State Separation.

Although you can wrap individual pages (and not wrap the pages/_app) it is not recommended, see last paragraph in usage section.

step 6
⚠️ 
You can dispatch actions from the pages/_app too. But this mode is not compatible with Next.js 9's Auto Partial Static Export feature, see the explanation below.

The wrapper can also be attached to your _app component (located in /pages). All other components can use the connect function of react-redux.

// pages/_app.tsx

import React from 'react';
import App from 'next/app';
import {wrapper} from '../components/store';

class MyApp extends App {
  static getInitialProps = wrapper.getInitialAppProps(store => async context => {
    store.dispatch({type: 'TOE', payload: 'was set in _app'});

    return {
      pageProps: {
        // https://nextjs.org/docs/advanced-features/custom-app#caveats
        ...(await App.getInitialProps(context)).pageProps,
        // Some custom thing for all pages
        pathname: ctx.pathname,
      },
    };
  });

  render() {
    const {Component, pageProps} = this.props;

    return <Component {...pageProps} />;
  }
}

export default wrapper.withRedux(MyApp);

setp 7
=> App and getServerSideProps or getStaticProps at page level

You can also use getServerSideProps or getStaticProps at page level, 
in this case HYDRATE action will be dispatched twice: with state after App.getInitialProps and then with state after getServerSideProps or getStaticProps:

If you use getServerSideProps at page level then store in getServerSideProps will be executed after App.getInitialProps and will have state from it, so second HYDRATE will have full state from both
⚠️ If you use getStaticProps at page level then store in getStaticProps will be executed at compile time and will NOT have state from App.getInitialProps because they are executed in different contexts and state cannot be shared. First HYDRATE actions state after App.getInitialProps and second will have state after getStaticProps (even though it was executed earlier in time).
Simplest way to ensure proper merging is to drop initial values from action.payload:


app.use(cros({
   "origin": ["http://192.168.29.45:3000", "http://192.168.29.201:3000"],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    "allowedHeaders": ['Content-Type', 'Authorization'],
    "exposedHeaders": ['Content-Range', 'X-Content-Range'],
    "maxAge": 4500,
    cookie: {
        sameSite: 'none',
        httpOnly: true,
        secure: false
    },
}))














 
