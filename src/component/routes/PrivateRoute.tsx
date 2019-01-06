import * as React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { AuthStore } from 'stores';

interface PrivateRouteProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    authStore?: AuthStore;
}
type RenderComponent = (props: RouteComponentProps<any>) => React.ReactNode;

@inject('authStore')
@observer
class PrivateRoute extends Route<PrivateRouteProps> {
    render() {
        const { authStore, component: Component, ...rest }: PrivateRouteProps = this.props;
        const renderComponent: RenderComponent = (props) => (
            authStore!.isAdmin
                ? <Component {...props} />
                : <Redirect to='/home' /> //TODO: Maybe should redirect somewhere else?
        );

        return (
            <Route {...rest} render={renderComponent} />
        );
    }
}

export default PrivateRoute;