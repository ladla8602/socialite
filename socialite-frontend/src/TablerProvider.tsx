import { PropsWithChildren, createContext } from 'react';

import '@tabler/core';

import '@tabler/core/dist/css/demo.min.css';
import '@tabler/core/dist/css/tabler.css';
import '@tabler/core/dist/css/tabler-vendors.min.css';

import '@tabler/icons-webfont/dist/tabler-icons.min.css';
import 'animate.css';
export const TablerContext = createContext({});

export const TablerProvider = ({ children }: PropsWithChildren) => {
  return <TablerContext.Provider value={{}}>{children}</TablerContext.Provider>;
};
