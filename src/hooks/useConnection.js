import { createContext, useContext } from 'react';

const ConnectionContext = createContext({});

export const ConnectionContextProvider = ConnectionContext.Provider;

export const useConnectionContext = () => useContext(ConnectionContext);
