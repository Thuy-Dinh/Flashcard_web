import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
// import * as actions from "../../store/actions"; //redux
import './signup.scss';
import { handleSignupApi } from '../../services/userService';
import { withRouter } from 'react-router-dom';

// import { FormattedMessage } from 'react-intl';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }
    }

    handleOnChangeUserName = (event) => {
        this.setState({
            username: event.target.value
        })
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
    handleSignup = async() => {
        this.setState({
            errMessage: ''
        });
        try {
            let data = await handleSignupApi(this.state.username, this.state.email, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                });
            } else {
                this.props.history.push('/login');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    });
                }
            }
        }
    }
    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    handleLoginRedirect = () => {
        this.props.navigate('/login');
    }
    
    render() {
        return (
            <div className='signup-background'>
                <div className='signup-container-left'>
                    <div className='signup-content row'>
                        <div className='col-12 text-title'>Tạo một tài khoản mới</div>
                        <div className='col-12 form-group signup-input'>
                            <label>Tên người dùng</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Nhập tên người dùng'
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUserName(event)}
                            />
                        </div>
                        <div className='col-12 form-group signup-input'>
                            <label>Email</label>
                            <input
                                type='email'
                                className='form-control'
                                placeholder='Nhập email'
                                value={this.state.email}
                                onChange={(event) => this.handleOnChangeEmail(event)}
                            />
                        </div>
                        <div className='col-12 form-group signup-input'>
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
                        <div className='col-12' style={{ color: 'red', paddingBottom: 15 }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12 text-center'>
                            <button className='text-signup' onClick={() => { this.handleSignup() }}>Đăng kí</button>
                        </div>
                        <div className='text-center other-signup'>
                            <div className='line'></div>
                            <div>Hoặc đăng kí bằng</div>
                            <div className='line'></div>
                        </div>
                        <div className='col-12 social-signup'>
                            <i className='fab fa-google'></i>
                            <i className='fab fa-facebook'></i>
                        </div>
                    </div>
                </div>
                <div className='signup-container-right'>
                    <div className='signup-content row'>
                        <div className='text-center text-welcome'>Chào mừng trở lại!</div>
                        <p className='text-center'>Bạn đã có tài khoản? Để tiếp tục công việc, hãy đăng nhập.</p>
                        <button className='login-btn' onClick={this.handleLoginRedirect}>Đăng nhập</button>
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

// const mapDispatchToProps = dispatch => {
//     return {
//         navigate: (path) => dispatch(push(path)),
//         adminSignupSuccess: (adminInfo) => dispatch(actions.adminSignupSuccess(adminInfo)),
//         adminSignupFail: () => dispatch(actions.adminSignupFail()),
//     };
// };
const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup));
