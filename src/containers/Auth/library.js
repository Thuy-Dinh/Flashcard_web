import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Header/Header';
import './library.scss';
import { handleGetAllFlashcardsApi, handleDelFlashcardsApi } from '../../services/flashcardService';

class Flashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem("persist:user")),
            arrFlashcards: []
        }
    }

    async componentDidMount() {
        this.loadFlashcards();
    }

    loadFlashcards = async () => {
        let userInfo = JSON.parse(this.state.user.userInfo);
        let userId = userInfo.id;
        let response = await handleGetAllFlashcardsApi(userId);
        if(response && response.errCode === 0) {
            this.setState({
                arrFlashcards: response.flashcards
            });
        }
    }

    handleRedirect = (flashcardId, topic, title) => {
        this.props.history.push({
            pathname: '/displayFlashcard',
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
        let userInfo = JSON.parse(this.state.user.userInfo);
        let userName = userInfo.firstName + " " + userInfo.lastName;
        let arrFlashcards = this.state.arrFlashcards;
        return (
            <>
                <Header />
                <div className='body'>
                    <div className='body-content'>
                        <div className='body-title'>LIBRARY</div>
                        <div className='body-library'>
                            {
                                arrFlashcards && arrFlashcards.map((item, index) => {
                                    return (
                                        <div className='library-item' key={index} >
                                            <div className='topic-fl'>{item.topic}</div>
                                            <div className='title-fl' onClick={() => this.handleRedirect(item.id, item.topic, item.title)}>{item.title}</div>
                                            <div className='author'>{userName}</div>
                                            <div className='btn-del' onClick={() => this.handleDelFlashcards(item.id)}>Xóa</div>
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
        language: state.app.language
    };
};

export default connect(mapStateToProps)(Flashcard);
