import Main from 'main/Main';
import {TokenProvider} from 'main/TokenProvider';
import React from 'react';

const App = () => {
  return (
    <TokenProvider>
      <Main />
    </TokenProvider>
  );
};

export default App;
