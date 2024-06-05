import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Header from '../Header/Header';
import './homepage.scss';

class Flashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToFlashcard: false // Trạng thái để điều hướng
        }
    }

    handleNavigateToFlashcard = () => {
        this.setState({ redirectToFlashcard: true }); // Thay đổi trạng thái khi bấm vào <div>
    }

    render() {
        if (this.state.redirectToFlashcard) {
            return <Redirect to='/flashcard' />; // Sử dụng Redirect để điều hướng
        }

        return (
            <>
                <Header />
                <div className='body'>
                    <div className='body-content'>
                        <div className='body-text'>Gần đây</div>
                        <div className='body-item'>
                            <div className='item-content'></div>
                        </div>
                        <div className='body-text'>Hãy thử tìm hiểu các tính năng sau</div>
                        <div className='body-item'>
                            <div className='item-content'>
                                <div className='search-img'></div>
                                <div className='item-title'>Tìm kiếm bộ Flash yêu thích</div>
                            </div>
                            <div className='item-content' onClick={this.handleNavigateToFlashcard}>
                                <div className='flashcard-img'></div>
                                <div className='item-title'>Tạo bộ thẻ flash</div>
                            </div>
                            <div className='item-content'>
                                <div className='test-img'></div>
                                <div className='item-title'>Tạo đề ôn tập</div>
                            </div>
                        </div>
                        <div className='body-text'>Tác giả hàng đầu</div>
                        <div className='body-item'>
                            <div className='item-content'></div>
                        </div>
                        <div className='body-text'>Bộ Flashcard phổ biến</div>
                        <div className='body-item'>
                            <div className='item-content'></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default connect(mapStateToProps)(Flashcard);
