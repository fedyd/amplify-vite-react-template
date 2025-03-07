/*import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}
*/

import React from 'react';
/*import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';*/
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { FaceLivenessDetectorCore, AwsCredentialProvider } from '@aws-amplify/ui-react-liveness';

import { ComponentStateType } from './main.tsx';
import { useComponentState, useStateManager } from './ComponentContext';

const credentialProvider: AwsCredentialProvider = async () => {
  // Fetch the credentials

  const response = await fetch('https://5v60rttes6.execute-api.eu-central-1.amazonaws.com/phase_1/credentials'); // This should be replaced with a real call to your own backend API
  const data = await response.json();
    
  return {
    accessKeyId: data.body.accessKeyId,
    secretAccessKey: data.body.secretAccessKey,
    sessionToken   : data.body.sessionToken,  // optional
    region: 'eu-west-1',
  };
}

function /*LivenessQuickStartReact*/App() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

  // 01 - get an instance of StateManager to get
  // an apportunity to update state 
  // via stateManager.updateState method
  const stateManager = useStateManager<ComponentStateType>();
  
  // 02 - extract the current state
  const state = useComponentState<ComponentStateType>();
  //const state_2 = useComponentState<ComponentStateType>();

  React.useEffect(() => {
    const fetchCreateLiveness: () => Promise<void> = async () => {
      
      const response = await fetch('https://pp3xmkg658.execute-api.eu-west-1.amazonaws.com/phase_1/createSession', { method: 'POST', body: JSON.stringify({ email: state.value.email, token: state.value.token})});
      const rekognitionSessionId = await response.json();
      
      await new Promise((r) => setTimeout(r, 2000));
      const mockResponse = { sessionId: rekognitionSessionId.body.SessionId };
      const data = mockResponse;

      setCreateLivenessApiData(data);
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete: () => Promise<void> = async () => {
    /*
    
     * This should be replaced with a real call to your own backend API
     */
    if (!createLivenessApiData) {
      console.error('createLivenessApiData is null');
      return;
    }

    const response = await fetch(
      `https://pp3xmkg658.execute-api.eu-west-1.amazonaws.com/phase_1/sessionResults?sessionId=${createLivenessApiData.sessionId}`
    );
    const data = await response.json();

    /*
     * Note: The isLive flag is not returned from the GetFaceLivenessSession API
     * This should be returned from your backend based on the score that you
     * get in response. Based on the return value of your API you can determine what to render next.
     * Any next steps from an authorization perspective should happen in your backend and you should not rely
     * on this value for any auth related decisions.
     */
    if (data.isLive) {
      console.log('User is live');
      stateManager.updateState({ value: {email: "user is ", token: "live"} });
    } else {
      console.log('User is not live');
      stateManager.updateState({ value: {email: "user is ", token: "not live"} });
    }
  };

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        createLivenessApiData && (
          <div>
          <div>
          <FaceLivenessDetectorCore
            sessionId={createLivenessApiData.sessionId}
            region="eu-west-1"
            onAnalysisComplete={handleAnalysisComplete}
            onError={(error) => {
              console.error(error);
            }}
            config={{ credentialProvider }}
          />
          </div>
          <div>
          <span>{state.value.email}</span>
          <span>{state.value.token}</span>
          </div>
          </div>
        )
      )}
      
    </ThemeProvider>
  );
}
export default App;
