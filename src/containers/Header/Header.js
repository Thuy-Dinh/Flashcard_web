import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu } from './menuApp';
import './Header.scss';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            searchInput: ''
        };
    }

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
        const { isFocused, searchInput } = this.state;

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
                <div className='header-user' onClick={processLogout}>
                    <div className='user-img'>T</div>
                    <div className='user-name'>Thùy Đinh</div>
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
