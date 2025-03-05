// src/ComponentContext.tsx

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { StateManager } from './utils/stateManager';

// Creazione del contesto con un valore di default vuoto
const ComponentContext = createContext({} as StateManager);

// Componente di contesto per fornire lo stato gestito tramite StateManager
export const ComponentContextComponent = function <T>({
  children,
  stateManager,
}: {
  children: ReactNode;
  stateManager: StateManager<T>;
}) {
  return (
    <ComponentContext.Provider value={stateManager}>
      {children}
    </ComponentContext.Provider>
  );
};

// Hook per utilizzare il StateManager dal contesto
export const useStateManager = <T,>(): StateManager<T> =>
  useContext(ComponentContext);

// Hook per utilizzare lo stato del componente e gestire i listener
export const useComponentState = <T = any> () => {
  const stateManager = useStateManager<T>();
  const [state, setState] = useState(stateManager.getState());
  
  useEffect(() => {
    const listener = (newState: T) => {
      setState(newState);
    };
    
    stateManager.subscribe(listener);
    return () => {
      stateManager.unsubscribe(listener);
    };
  }, []);

  return state;
};
