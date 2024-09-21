import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { APIServiceProvider } from './modules/core/services/api.services';
import { persister, store } from './modules/core/store/store';
import { TablerProvider } from './TablerProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <BrowserRouter>
    <TablerProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
          <APIServiceProvider>{children}</APIServiceProvider>
        </PersistGate>
      </Provider>
    </TablerProvider>
  </BrowserRouter>
);

export default Providers;
