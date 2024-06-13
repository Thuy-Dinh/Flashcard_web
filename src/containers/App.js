import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';


import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';

import { path } from '../utils'

import Home from '../routes/Home';
import Login from './Auth/login';
import Signup from './Auth/signup';
import HomePage from './Auth/homepage';
import UserManage from './System/UserManage';
import Flashcard from './Auth/flashcard';
import Library from './Auth/library';
import Display from './Auth/displayFlashcard';
import Result from './Auth/searchResult';
import Collection from './Auth/collection';
// import Login from '../routes/Login';
// import Header from './Header/Header';
// import System from '../routes/System';

import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';

import CustomScrollbars from '../components/CustomScrollbars'

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />
                        {this.props.isLoggedIn}

                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.SIGNUP} component={userIsNotAuthenticated(Signup)} />
                                    <Route path={path.HOMEPAGE} component={userIsAuthenticated(HomePage)} />
                                    <Route path={path.USERMANAGE} component={userIsAuthenticated(UserManage)} />
                                    <Route path={path.FLASHCARD} component={userIsAuthenticated(Flashcard)} />
                                    <Route path={path.LIBRARY} component={userIsAuthenticated(Library)} />
                                    <Route path={path.DISPLAY} component={userIsAuthenticated(Display)} />
                                    <Route path={path.RESULT} component={userIsAuthenticated(Result)} />
                                    <Route path={path.COLLECTION} component={userIsAuthenticated(Collection)} />
                                </Switch>
                            </CustomScrollbars>
                        </div>

                        <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);