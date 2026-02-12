/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-constructed-context-values */

import { createContext, useState, useContext } from 'react';

const FormatContext = createContext();

export function FormatProvider({ children }) {
  const [format, setFormat] = useState(12);

  return <FormatContext.Provider value={{ format, setFormat }}>{children}</FormatContext.Provider>;
}

// Hook pratique
export function useFormat() {
  return useContext(FormatContext);
}
