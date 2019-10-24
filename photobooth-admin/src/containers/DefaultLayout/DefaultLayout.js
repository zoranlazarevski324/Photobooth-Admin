import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import logo from '../../assets/images/logo.png'
import config from '../../config'

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
// const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

    constructor(props){
        super(props);
        this.state = {
            signed: true, 
            login_user: null,
            m_nav: {items: []}
        }
    }

    componentDidMount() {
        const login_user = JSON.parse(window.localStorage.getItem('login_user'))
        if(login_user === null)
            this.setState({login_user, m_nav: {items: []}})
        else 
            this.setState({login_user, m_nav: navigation[login_user.roll]})
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    signOut = () => {
        window.localStorage.removeItem('login_user')
        this.setState({signed: false})
    }

    render() {
        if(!this.state.signed) {
            return (<Redirect to="/login" />)
        }

        return (
            <div className="app">
                <div className="app-body">
                    <AppSidebar fixed display="lg">
                        <AppSidebarHeader />
                        <AppSidebarForm />
                        <div align="center">
                            <img src={logo} className="layout-logo" alt=""/>
                        </div>
                        <div className="divider"></div>
                        <div className="user-info">
                            {
                                this.state.login_user && this.state.login_user.logo ? (
                                    <img src={config.backendUrl + this.state.login_user.logo} alt="" />
                                ) : (
                                    <div className="empty-logo"></div>
                                )
                            }
                            <span>{this.state.login_user && this.state.login_user.contact_first_name + ' ' + this.state.login_user.contact_last_name}</span>
                        </div>
                        <div className="divider"></div>
                        <Suspense>
                            <AppSidebarNav navConfig={this.state.m_nav} {...this.props} />
                        </Suspense>
                        <AppSidebarFooter />
                        <div className="signout-frame" onClick={() => this.signOut()}>
                            <span><i className="fa fa-sign-out"></i> Logout</span>
                        </div>
                    </AppSidebar>
                    <main className="main">
                        <AppBreadcrumb appRoutes={routes}/>
                        <Container fluid>
                            <Suspense fallback={this.loading()}>
                                <Switch>
                                    {
                                        routes.map((route, idx) => {
                                            return route.component ? (
                                                <Route
                                                key={idx}
                                                path={route.path}
                                                exact={true}
                                                name={route.name}
                                                render={props => (
                                                    <route.component {...props} />
                                                )} />
                                            ) : (null);
                                        })
                                    }
                                    {
                                        this.state.login_user ? (
                                            this.state.login_user.roll === 0 ? (
                                                <Redirect exact={true} from="/" to="/clients" />
                                            ) : (
                                                <Redirect exact={true} from="/" to="/events" />
                                            )
                                        ) : (
                                            <Redirect exact={true} from="/" to="/login" />
                                        )
                                    }                                    
                                </Switch>
                            </Suspense>
                        </Container>
                    </main>
                    <AppAside fixed>
                        <Suspense fallback={this.loading()}>
                            <DefaultAside />
                        </Suspense>
                    </AppAside>
                </div>
                <AppFooter>
                    <Suspense fallback={this.loading()}>
                        <DefaultFooter />
                    </Suspense>
                </AppFooter>
            </div>
        )
    }
}

export default DefaultLayout;
