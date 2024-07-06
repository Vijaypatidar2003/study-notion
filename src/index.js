import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import rootReducer from "./reducer";
import {configureStore} from '@reduxjs/toolkit'


//for creating store we call the configureStore passing it reducer but there are many reducers  so we have combined
//all the reducers and created a rootReducer which is wraped in store
const store=configureStore({
  reducer:rootReducer,
})

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //to provide store to react application we must wrap it into Provider and provides store
  
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
);
