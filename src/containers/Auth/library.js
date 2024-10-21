import React, { Component } from 'react';
import Header from '../Auth/hearder';
import { connect } from 'react-redux';
import './library.scss';
import { handleGetAllFlashcardsApi, handleDelFlashcardsApi } from '../../services/flashcardService';

class Flashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrFlashcards: []
        }
    }

    async componentDidMount() {
        this.loadFlashcards();
    }

    loadFlashcards = async () => {
        let userId = this.props.userInfo.id;
        let response = await handleGetAllFlashcardsApi(userId);
        if(response && response.errCode === 0) {
            this.setState({
                arrFlashcards: response.flashcards
            });
        }
    }

    handleRedirectToDisplay = (flashcardId, topic, title, userName, quantity) => {
        this.props.history.push({
            pathname: '/displayFlashcard',
            search: `?flashcardId=${flashcardId}&topic=${topic}&title=${title}&username=${userName}&quantity=${quantity}`
        });
    }

    handleRedirectToEdit = (flashcardId, topic, title) => {
        this.props.history.push({
            pathname: '/editFlashcard',
            search: `?flashcardId=${flashcardId}&topic=${topic}&title=${title}`
        });
    }

    handleDelFlashcards = async (flashcardId) => {
        let response = await handleDelFlashcardsApi(flashcardId);
        if(response && response.errCode === 0) {
            // Reload flashcards after successful deletion
            this.loadFlashcards();
        } else {
            // Handle error if needed
            console.error('Failed to delete flashcard');
        }
    }

    render() {
        const { userInfo } = this.props;
        let userName = userInfo.firstName + " " + userInfo.lastName;
        let arrFlashcards = this.state.arrFlashcards;
        return (
            <>
                <Header />
                <div className='body'>
                    <div className='body-content'>
                        <div className='body-title'>Thư viện</div>
                        <div className='body-library'>
                            {
                                arrFlashcards && arrFlashcards.map((item, index) => {
                                    return (
                                        <div className='library-item' key={index} >
                                            <div className='library-content'>
                                                <div className='topic-fl'>{item.topic}</div>
                                                <div className='title-fl' onClick={() => this.handleRedirectToDisplay(item.id, item.topic, item.title, userName, item.quantity)}>{item.title}</div>
                                                <div className='author'>{userName}</div>
                                                <div className='number'>{item.quantity}</div>
                                            </div>
                                            <div className='number-fl'>
                                                <div className='btn'>
                                                    <div className='btn-del' onClick={() => this.handleRedirectToEdit(item.id, item.topic, item.title)}>Sửa</div>
                                                    <div className='btn-del' onClick={() => this.handleDelFlashcards(item.id)}>Xóa</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

export default connect(mapStateToProps)(Flashcard);
