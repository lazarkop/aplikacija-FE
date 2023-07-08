import { store } from "./redux-toolkit/store";
import { RenderOptions, RenderResult, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router } from "react-router-dom";
import PropTypes from "prop-types";
import React, { ReactElement } from "react";

type ProvidersProps = {
  children: React.JSX.Element;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider store={store}>
      <Router>{children}</Router>
    </Provider>
  );
};
Providers.propTypes = {
  children: PropTypes.node.isRequired,
};

const customRender = (
  ui: ReactElement,
  options?: RenderOptions
): RenderResult => render(ui, { wrapper: Providers, ...options });

const renderWithRouter = (ui: ReactElement) => {
  const history = createBrowserHistory();
  return {
    history,
    ...render(ui, { wrapper: Providers }),
  };
};

// eslint-disable-next-line import/export
export * from "@testing-library/react";
// eslint-disable-next-line import/export
export { customRender as render };
export { renderWithRouter };
