import React, { Component } from 'react';
import Header from '../Auth/hearder';
import { connect } from 'react-redux';
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
            if (response && response.errCode === 0) {
                let flippedCards = {}; // Khởi tạo trạng thái lật của từng flashcard
                response.flashcard.forEach(card => {
                    flippedCards[card.id] = false; // Ban đầu không có flashcard nào được lật
                });
                this.setState({
                    arrFlashcard: response.flashcard,
                    flippedCards
                });
    
                let flashcardTopic = queryParams.get('topic');
                let flashcardTitle = queryParams.get('title');
                let userName = queryParams.get('username');
                let quantity = queryParams.get('quantity');
                let userId = this.props.userInfo.id;
                const flashcard = {
                    id: flashcardId,
                    topic: flashcardTopic,
                    title: flashcardTitle,
                    userName: userName,
                    quantity: quantity
                };
    
                // Lấy danh sách các flashcards đã xem gần đây từ local storage
                let recentFlashcards = JSON.parse(localStorage.getItem(`recentFlashcards_${userId}`)) || [];
                // Kiểm tra xem flashcard đã tồn tại trong danh sách recentFlashcards chưa
                const existingIndex = recentFlashcards.findIndex(card => card.id === flashcard.id);
                if (existingIndex !== -1) {
                    // Nếu đã tồn tại, loại bỏ để đưa lên đầu
                    recentFlashcards.splice(existingIndex, 1);
                }
                // Thêm flashcard mới vào đầu danh sách
                recentFlashcards.unshift(flashcard);
                // Giới hạn số lượng phần tử lưu trữ
                recentFlashcards = recentFlashcards.slice(0, 3);
                // Lưu danh sách lại vào local storage
                localStorage.setItem(`recentFlashcards_${userId}`, JSON.stringify(recentFlashcards));
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

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo
    };
};

export default withRouter(connect(mapStateToProps)(DisplayFlashcard));
