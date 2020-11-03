import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { AppStatusProvider } from './context/useAppStatus';

test('renders learn react link', () => {
  const { getByText } = render(
    <AppStatusProvider>
      <App />
    </AppStatusProvider>
  );

  expect(getByText(/liberators/i)).toBeInTheDocument();
});
