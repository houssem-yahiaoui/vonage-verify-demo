import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import theme from "./chakra.extendedtheme"

// App Performance & Utilities 

import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker";

// State
import { store, persistor } from './store'
import { Provider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";

// Components
import TwoFactorVerifier from "./landing/TwoFactorVerifier";
import Landing from "./landing/Landing";
import Navbar from "./shared/Navbar";


const container = document.getElementById("root")
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />}/>
              <Route path="two-factor-verification" element={<TwoFactorVerifier />}></Route>
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

