import React, { useContext, useEffect } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Page,
  PageHeader,
  PageSidebar,
  Brand,
  Dropdown,
  DropdownToggle,
  Toolbar,
  Nav,
  NavItem,
  NavList,
  ToolbarItem,
  ToolbarGroup,
  NavVariants,
} from '@patternfly/react-core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { FeatureRequest } from './components/feature_request';
import { PrivateRoute } from './components/authentication/private_route';
import { CallbackHandler } from './components/authentication/callback_handler';
import { NavDefaultList } from './components/navigation/nav';
import { EngagementForm } from './routes/engagement_form';
import { SessionContext, SessionProvider } from './context/session_context';
import { ConfigContext, ConfigProvider } from './context/config_context';
import Axios from 'axios';
import { EngagementFormProvider } from './context/engagement_form_context';
import { PopupProvider } from './context/popup_context';
import { UserDropdown } from './components/user_dropdown';

export const App = () => {
  return (
    <Router>
      <ConfigProvider>
        <SessionProvider>
          <Routes />
        </SessionProvider>
      </ConfigProvider>
    </Router>
  );
};

const Routes = () => {
  const configContext = useContext(ConfigContext);
  const sessionContext = useContext(SessionContext);
  useEffect(() => {
    Axios.get(`${process.env.PUBLIC_URL}/config/config.json`).then(
      ({ data }) => {
        configContext.setConfig(data);
      }
    );
  }, [configContext]);
  if (configContext.isLoading) {
    return <div />;
  }

  return (
    <PopupProvider>
      <Page
        header={
          <PageHeader
            topNav={
              <Nav>
                <NavList variant={NavVariants.horizontal}>
                  <NavItem preventDefault isActive={false}>
                    <Dropdown
                      isPlain
                      toggle={<DropdownToggle>Hello</DropdownToggle>}
                    ></Dropdown>
                  </NavItem>
                </NavList>
              </Nav>
            }
            showNavToggle
            logo={
              <Brand
                alt="Open Innovation Labs"
                src={`${process.env.PUBLIC_URL}/oil_logo.png`}
              ></Brand>
            }
            toolbar={
              <Toolbar>
                <ToolbarGroup>
                  <ToolbarItem>
                    <UserDropdown />
                  </ToolbarItem>
                </ToolbarGroup>
              </Toolbar>
            }
          ></PageHeader>
        }
        isManagedSidebar={true}
        sidebar={
          <PageSidebar isManagedSidebar theme="dark" nav={<NavDefaultList />} />
        }
        style={{ height: '100vh' }}
      >
        <Switch>
          <PrivateRoute
            exact
            path="/"
            component={(props: any) => {
              return (
                <EngagementFormProvider
                  sessionContext={sessionContext}
                  configContext={configContext}
                >
                  <EngagementForm {...props} />
                </EngagementFormProvider>
              );
            }}
          />
          <Route path="/feature-request" component={FeatureRequest} />
          <PrivateRoute path="/private" component={() => <Redirect to="/" />} />
          <Route path="/auth_callback" component={CallbackHandler} />
        </Switch>
      </Page>
    </PopupProvider>
  );
};
