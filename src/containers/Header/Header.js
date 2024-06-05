import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import { Redirect } from 'react-router-dom';
// import Navigator from '../../components/Navigator';
// import { adminMenu } from './menuApp';
import './Header.scss';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            searchInput: '',
            redirectToUserManage: false
        };
        this.wrapperRef = React.createRef();
    }


    handleNavigateToUserManage = () => {
        this.setState({ redirectToUserManage: true }); // Thay đổi trạng thái khi bấm vào <div>
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
        const { isNavigatorVisible, isFocused, searchInput, redirectToUserManage } = this.state;

        if (this.state.redirectToUserManage) {
            return <Redirect to='/usermanage' />; // Sử dụng Redirect để điều hướng
        }

        return (
            <div className="header-container">
                <div className='header-logo'>
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
                        <div className='user-img'>T</div>
                        <div className='user-name'>Thùy Đinh</div>
                    </div>
                    {isNavigatorVisible && (
                        <div ref={this.wrapperRef} className="header-navigator" tabIndex="-1">
                            <div className='header-item' onClick={this.handleNavigateToUserManage}>Quản lí tài khoản</div>
                            <div className='header-item'>Thư viện</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
