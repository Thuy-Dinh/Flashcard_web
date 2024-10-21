import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Auth/hearder';
import './collection.scss';
import { handleGetAllCollectionApi, handleDelCollectionApi } from '../../services/collectionService';

class Flashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrCollection: [],
        }
    }

    handleRedirect = (flashcardId, topic, title, userName, quantity) => {
        this.props.history.push({
            pathname: '/displayFlashcard',
            search: `?flashcardId=${flashcardId}&topic=${topic}&title=${title}&username=${userName}&quantity=${quantity}`
        });
    }

    async componentDidMount() {
        this.loadFlashcards();
    }

    loadFlashcards = async () => {
        let userId = this.props.userInfo.id;

        let collections = await handleGetAllCollectionApi(userId);

        this.setState({
            arrCollection: collections.collections
        })
    }

    handleDelCollection = async(collectionId) => {
        let response = await handleDelCollectionApi(collectionId);
        if(response && response.errCode === 0) {
            // Reload flashcards after successful deletion
            this.loadFlashcards();
        } else {
            // Handle error if needed
            console.error('Failed to delete flashcard');
        }
    }

    render() {

        let arrCollection = this.state.arrCollection;
        
        return (
            <>
                <Header />
                <div className='body'>
                    <div className='body-content'>
                        <div className='body-title'>Bộ sưu tập</div>
                        <div className='body-library'>
                            {
                                arrCollection && arrCollection.map((item, index) => {
                                    return (
                                        <div className='library-item' key={index} >
                                            <div className='library-content'>
                                                <div className='topic-fl'>{item.topic}</div>
                                                <div className='title-fl' onClick={() => this.handleRedirect(item.flashcardId, item.topic, item.title, item.userName, item.quantity)}>{item.title}</div>
                                                <div className='author'>{item.userName}</div>
                                            </div>
                                            <div className='number-fl'>
                                                <div className='number'>{item.quantity}</div>
                                                <div className='btn-del' onClick={() => this.handleDelCollection(item.id)}>Xóa</div>
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
