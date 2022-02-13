import { createContext, useContext } from 'react';

const DLSContext = createContext({});

export const DLSProvider = DLSContext.Provider;

export const useDLS = () => useContext(DLSContext);
