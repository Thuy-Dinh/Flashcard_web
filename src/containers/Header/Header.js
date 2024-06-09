import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom'; // Import withRouter và Redirect từ react-router-dom
import * as actions from "../../store/actions";
import './Header.scss';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            searchInput: '',
            user: JSON.parse(localStorage.getItem("persist:user"))
        };
        this.wrapperRef = React.createRef();
    }

    hanleRedirectToHome = () => {
        this.props.history.push('/home');
    }

    hanleRedirectToUserManage = () => {
        this.props.history.push('/usermanage');
    }

    hanleRedirectToLibrary = () => {
        this.props.history.push('/library');
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ isNavigatorVisible: false });
        }
    };

    toggleNavigator = () => {
        this.setState(prevState => ({
            isNavigatorVisible: !prevState.isNavigatorVisible
        }));
    };

    handleFocus = () => {
        this.setState({ isFocused: true });
    };

    handleBlur = () => {
        this.setState({ isFocused: false });
    };

    handleInputChange = (event) => {
        this.setState({ searchInput: event.target.value });
    };

    handleClearInput = () => {
        this.setState({ searchInput: '' });
    };

    render() {
        const { processLogout } = this.props;
        const { isNavigatorVisible, isFocused, searchInput } = this.state;

        let userInfo = JSON.parse(this.state.user.userInfo);
        let userName = userInfo.firstName + " " + userInfo.lastName;
        let userInitial = userInfo.firstName.charAt(0).toUpperCase();

        return (
            <div className="header-container">
                <div className='header-logo' onClick={this.hanleRedirectToHome}>
                    <div className='img-logo'></div>
                    <div className='text-logo'>Flashcards</div>
                </div>
                <div className='header-center'>
                    <div className='header-search'>
                        <input
                            placeholder='Tìm kiếm bất cứ điều gì'
                            className='search-input'
                            value={searchInput}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            onChange={this.handleInputChange}
                        >
                        </input>
                        {isFocused && searchInput && (
                            <i className='fas fa-times clear-icon' onMouseDown={this.handleClearInput}></i>
                        )}
                        <i className='fas fa-search search-icon'></i>
                    </div>
                </div>
                <div className='header-right'>
                    <div className='header-user' onClick={this.toggleNavigator}>
                        <div className='user-img'>{userInitial}</div>
                        <div className='user-name'>{userName}</div>
                    </div>
                    {isNavigatorVisible && (
                        <div ref={this.wrapperRef} className="header-navigator">
                            <div className='header-item' onClick={this.hanleRedirectToUserManage}>Quản lí tài khoản</div>
                            <div className='header-item' onClick={this.hanleRedirectToLibrary}>Thư viện</div>
                            <div className='header-item'>Bộ sưu tập</div>
                            <div className='header-item' onClick={processLogout}>Đăng xuất</div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

// Bọc component bằng withRouter để component có thể nhận được history prop
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));