import { createContext, useContext, useState } from 'react';

const ViewContext = createContext<any>(null);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState('table');
  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
}

export const useView = () => useContext(ViewContext);
