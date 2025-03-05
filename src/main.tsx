import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { ComponentContextComponent } from "./ComponentContext.tsx";
import { StateManager } from "./utils/stateManager.ts";

Amplify.configure(outputs);

declare global {
  interface Window {
    initPlugin: (id: string) => StateManager;
  }
}

// 01 - declare an initial state that should be exposed outside
const initState = { value: 'initial value' };
export type ComponentStateType = typeof initState;



window.initPlugin = (id: string) => {
  const root = ReactDOM.createRoot(
    document.getElementById(id) as HTMLElement
  );

  // 02 - create an instance of StateManager with the initial state
  const stateManager = new StateManager(initState);
  
  root.render(
    <React.StrictMode>
      {/* 
         03 - wrap component with Context propogated StateManager instance
      */}
      <ComponentContextComponent stateManager={stateManager}>
        <App />
      </ComponentContextComponent>
    </React.StrictMode>
  );

  return stateManager;

};

/*ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);*/
