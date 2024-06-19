import React, {createContext, useState, useContext} from 'react';

type TokenContextType = {
  token: string;
  setToken: (token: string) => void;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({children}: {children: React.ReactNode}) => {
  const [token, setToken] = useState<string>('');

  return (
    <TokenContext.Provider value={{token, setToken}}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
