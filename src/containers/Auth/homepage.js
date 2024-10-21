import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from '../Auth/hearder';
import './homepage.scss';

class Flashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recentFlashcards: []
        };
    }

    componentDidMount() {
        const userId = this.props.userInfo.id;
        const recentFlashcards = JSON.parse(localStorage.getItem(`recentFlashcards_${userId}`)) || [];

        // Giới hạn số lượng flashcard hiển thị là 3
        const recentThreeFlashcards = recentFlashcards.slice(0, 3);

        this.setState({ recentFlashcards: recentThreeFlashcards });
    }

    handleRedirectToFlashcard = () => {
        this.props.history.push('/flashcard');
    }

    handleRedirectToDisplay = (flashcardId, topic, title, userName, quantity) => {
        this.props.history.push({
            pathname: '/displayFlashcard',
            search: `?flashcardId=${flashcardId}&topic=${topic}&title=${title}&username=${userName}&quantity=${quantity}`
        });
    }

    render() {
        const { recentFlashcards } = this.state;

        return (
            <>
                <Header />
                <div className='body-container'>
                    <div className='body-content'>
                        <div className='body-text'>Gần đây</div>
                        <div className='body-item'>
                            {recentFlashcards.map(flashcard => (
                                <div className='item-content' key={flashcard.id}>
                                    <div className='item-title' style={{ fontSize: 20, marginTop: 10 }} onClick={() => this.handleRedirectToDisplay(flashcard.id, flashcard.topic, flashcard.title, flashcard.userName, flashcard.quantity)}>
                                        <div className='item-topic'>{flashcard.topic}</div>
                                        <div className='item-subtitle'>{flashcard.title}</div>
                                        <div className='item-quantity'>{flashcard.quantity} thuật ngữ</div>
                                        <div className='item-info'>Tác giả: {flashcard.userName}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='body-text'>Hãy thử tìm hiểu các tính năng sau</div>
                        <div className='body-item'>
                            <div className='item-content'>
                                <div className='search-img'></div>
                                <div className='item-title'>Tìm kiếm bộ Flash yêu thích</div>
                            </div>
                            <div className='item-content' onClick={this.handleRedirectToFlashcard}>
                                <div className='flashcard-img'></div>
                                <div className='item-title'>Tạo bộ thẻ flash</div>
                            </div>
                            <div className='item-content'>
                                <div className='test-img'></div>
                                <div className='item-title'>Tạo đề ôn tập</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

export default withRouter(connect(mapStateToProps)(Flashcard));
