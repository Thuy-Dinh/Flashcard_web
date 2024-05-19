import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions"; //redux
import './login.scss';
import { FormattedMessage } from 'react-intl';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isShowPassword: false
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }
    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }
    handleLogin = () => {
        console.log('email: ', this.state.email, 'password: ', this.state.password)
        console.log('all state: ', this.state)
    }
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    handleSignupRedirect = () => {
        this.props.navigate('/signup');
    }
    render() {
        return (
            <div className='login-background'>
                <div className='login-container-left'>
                    <div className='login-content row'>
                        <div className='text-center text-welcome'>Welcome Back!</div>
                        <p className='text-center'>Do you have an account ? Let's get you set up.</p>
                        <button className='signup-btn' onClick={this.handleSignupRedirect}>Đăng kí</button>
                    </div>
                </div>
                <div className='login-container-right'>
                    <div className='login-content row'>
                        <div className='col-12 text-title'>Đăng nhập</div>
                        <div className='col-12 form-group login-input'>
                            <label>Email</label>
                            <input
                                type='email'
                                className='form-control'
                                placeholder='Nhập email'
                                value={this.state.email}
                                onChange={(event) => this.handleOnChangeEmail(event)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Mật khẩu</label>
                            <div className='custom-password'>
                                <input
                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Nhập mật khẩu'
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                />
                                <span onClick={() => { this.handleShowHidePassword() }}>
                                    <i class={this.state.isShowPassword ? 'far fa-eye' : 'far fa-eye-slash'}></i>
                                </span>
                            </div>
                        </div>
                        <div className='col-12 text-center'>
                            <button className='text-login' onClick={() => { this.handleLogin() }}>Đăng nhập</button>
                        </div>
                        <div className='col-12 forgot-password'>
                            <span>Quên mật khẩu?</span>
                        </div>
                        <div className='text-center other-login'>
                            <div className='line'></div>
                            <div>Hoặc đăng nhập bằng</div>
                            <div className='line'></div>
                        </div>
                        <div className='col-12 social-login'>
                            <i className='fab fa-google'></i>
                            <i className='fab fa-facebook'></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
        adminLoginFail: () => dispatch(actions.adminLoginFail()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);