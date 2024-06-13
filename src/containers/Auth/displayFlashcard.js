import React, { Component } from 'react';
import Header from '../Header/Header';
import { withRouter } from 'react-router-dom'; 
import { handleGetAFlashcardsApi } from '../../services/flashcardService';
import './displayFlashcard.scss';

class DisplayFlashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flashcardId: null,
            arrFlashcard: [],
            flippedCards: {} // Trạng thái lật của từng flashcard
        };
    }

    async componentDidMount() {
        let queryParams = new URLSearchParams(this.props.location.search);
        let flashcardId = queryParams.get('flashcardId');

        if (flashcardId) {
            this.setState({ flashcardId });

            let response = await handleGetAFlashcardsApi(flashcardId);
            console.log(response);
            if(response && response.errCode === 0) {
                let flippedCards = {}; // Khởi tạo trạng thái lật của từng flashcard
                response.flashcard.forEach(card => {
                    flippedCards[card.id] = false; // Ban đầu không có flashcard nào được lật
                });
                this.setState({
                    arrFlashcard: response.flashcard,
                    flippedCards
                });
            }
        } 
    }

    handleCardFlip = (cardId) => {
        this.setState(prevState => ({
            flippedCards: {
                ...prevState.flippedCards,
                [cardId]: !prevState.flippedCards[cardId] // Đảo ngược trạng thái lật của flashcard
            }
        }));
    }

    render() {
        let queryParams = new URLSearchParams(this.props.location.search);
        let flashcardTopic = queryParams.get('topic');
        let flashcardTitle = queryParams.get('title');
        let arrFlashcard = this.state.arrFlashcard;
        let flippedCards = this.state.flippedCards;
        return (
            <>
                <Header />
                <div className='body'>
                    <div className='body-content'>
                        <div className='body-topic-fl'>{ flashcardTopic }</div>
                        <div className='body-title-fl'>{ flashcardTitle }</div>
                        <div className='body-flashcard'>
                            {
                                arrFlashcard && arrFlashcard.map((item, index) => {
                                    return (
                                        <div className={`flashcard-item ${flippedCards[item.id] ? 'flipped' : ''}`} key={index} onClick={() => this.handleCardFlip(item.id)}>
                                            <div className='terminology'>{flippedCards[item.id] ? item.identify : item.terminology}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(DisplayFlashcard);
