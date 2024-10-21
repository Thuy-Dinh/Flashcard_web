import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import * as actions from "../../store/actions";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { handleRecommendSearchApi } from "../../services/flashcardService";

const RecommendWrapper = styled.div`
    background-color: white;
    border-radius: 8px;

    .recommend-item {
        padding: 5px 10px;
        display: flex;
        gap: 10px;
        cursor: pointer;

        &:first-child {
            border-top-right-radius: 8px;
            border-top-left-radius: 8px;
        }

        &:last-child {
            border-bottom-right-radius: 8px;
            border-bottom-left-radius: 8px;
        }

        &:hover {
            background-color: #ccc;
        }
    }
`;

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFocused: false,
            searchInput: '',
            searchResult: []
        };
        this.wrapperRef = React.createRef();
    }

    hanleRedirectToHome = () => {
        this.props.history.push('/home');
        window.location.reload();
    }

    hanleRedirectToUserManage = () => {
        this.props.history.push('/usermanage');
    }

    hanleRedirectToLibrary = () => {
        this.props.history.push('/library');
    }

    hanleRedirectToCollection = () => {
        this.props.history.push('/collection');
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps, prevState) {
        // Ensure the styles are applied correctly after update
        if (prevState.searchResult !== this.state.searchResult) {
            // Any necessary logic to ensure reflow/repaint or re-render
            this.forceUpdate();
        }
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

    handleInputChange = async (event) => {
        const searchInput = event.target.value;
        this.setState({ searchInput });

        if (searchInput) {
            await this.handleRecommendSearch(searchInput);
        } else {
            this.setState({ searchResult: [] });
        }
    };

    handleClearInput = () => {
        this.setState({ searchInput: '', searchResult: [] });
    };

    handleSearch = (request) => {
        this.props.history.push({
            pathname: '/searchResult',
            search: `?request=${request}`
        });
    };

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.handleSearch(this.state.searchInput);
        }
    };

    handleRecommendSearch = async (request) => {
        this.setState({
            searchResult: ''
        });
        let userId = this.props.userInfo.id;
        let data = await handleRecommendSearchApi(userId, request);
        this.setState({
            searchResult: data.data
        });
    }

    handleRedirect = (title) => {
        this.props.history.push({
            pathname: '/searchResult',
            search: `?request=${title}`
        });
    }

    render() {
        const { userInfo } = this.props;
        const { processLogout } = this.props;
        const { isNavigatorVisible, isFocused, searchInput, searchResult } = this.state;

        let userName = userInfo.firstName + " " + userInfo.lastName;
        let userInitial = userInfo.firstName.charAt(0).toUpperCase();

        return (
            <div className="header-container">
                <div className='header-logo' onClick={this.hanleRedirectToHome}>
                    <div className='img-logo'></div>
                    <div className='text-logo'>Flashcards</div>
                </div>
                <div className='header-center'>
                    <Tippy
                        interactive 
                        render={attrs => (
                            <div ref={this.wrapperRef} tabIndex="-1" {...attrs}>
                                <RecommendWrapper className="result-recommend">
                                    {searchResult && searchResult.map((record, index) => (
                                        <div key={index} className='recommend-item' onClick={() => this.handleRedirect(record.title)}>
                                            <div>{record.topic}:</div>
                                            <div>{record.title}</div>
                                        </div>
                                    ))}
                                </RecommendWrapper>
                            </div>
                        )}
                    >
                        <div className='header-search'>
                            <input
                                placeholder='Tìm kiếm bất cứ điều gì'
                                className='search-input'
                                value={searchInput}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onChange={this.handleInputChange}
                                onKeyDown={this.handleKeyDown}
                            />
                            {isFocused && searchInput && (
                                <i className='fas fa-times clear-icon' onMouseDown={this.handleClearInput}></i>
                            )}
                            <Tippy content="Tìm kiếm">
                                <i className='fas fa-search search-icon' onClick={() => { this.handleSearch(searchInput) }}></i>
                            </Tippy>
                        </div>
                    </Tippy>
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
                            <div className='header-item' onClick={this.hanleRedirectToCollection}>Bộ sưu tập</div>
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
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
