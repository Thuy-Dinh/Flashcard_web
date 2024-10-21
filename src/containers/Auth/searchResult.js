import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../Auth/hearder';
import './searchResult.scss';
import { handleSearchApi } from '../../services/flashcardService';
import { handleCreateCollectionApi } from "../../services/collectionService";

class Flashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrResult: [],
            request: null,
            errMessage: '',
            selectedFlashcardId: null
        }
    }

    async componentDidMount() {
        this.handleSearch();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            this.handleSearch();
        }
    }

    handleSearch = async () => {
        let queryParams = new URLSearchParams(this.props.location.search);
        let request = queryParams.get('request');
        console.log(request);
        if (request) {
            this.setState({ request });
            let userId = this.props.userInfo.id;
            let result = await handleSearchApi(userId, request);
            console.log(result);
            if (result && result.data) { // Kiểm tra nếu result và result.data tồn tại
                this.setState({
                    arrResult: Array.isArray(result.data) ? result.data : [] // Đảm bảo rằng arrResult luôn là một mảng
                });
            }
        }
    }

    handleCreateCollection = async(flashcardId) => {
        this.setState ({
            errMessage: '',
            selectedFlashcardId: flashcardId
        })

        try {
            let userId = this.props.userInfo.id;

            let collection = await handleCreateCollectionApi(flashcardId, userId);
            if(collection && collection.errCode !== 0) {
                this.setState({
                    errMessage: collection.message
                });
            } else {
                this.setState({
                    errMessage: 'Thêm thành công'
                });
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    });
                }
            }
        }
        
    }

    handleRedirect = (flashcardId, topic, title, userName, quantity) => {
        this.props.history.push({
            pathname: '/displayFlashcard',
            search: `?flashcardId=${flashcardId}&topic=${topic}&title=${title}&username=${userName}&quantity=${quantity}`
        });
    }

    render() {
        let queryParams = new URLSearchParams(this.props.location.search);
        let request = queryParams.get('request');
        let arrResult = this.state.arrResult;
        let message = this.state.errMessage;
        let selectedFlashcardId = this.state.selectedFlashcardId;
        return (
            <>
                <Header />
                <div className='body'>
                    <div className='body-content'>
                        <div className='search-title'>Tìm kiếm: {request}</div>
                        <div className='search-result'>
                            {
                                arrResult.length > 0 ? (
                                    arrResult.map((item, index) => (
                                        <div key={index}>
                                        <div className='result-item'>
                                            <div className='result-content'>
                                                <div className='topic-result'>{item.topic}</div>
                                                <div className='title-result' onClick={() => this.handleRedirect(item.flashcardsId, item.topic, item.title, item.userName, item.quantity)}>{item.title}</div>
                                                <div className='author'>{item.userName}</div>
                                            </div>
                                            <div className='number-fl'>
                                                <div className='number-rs'>{item.quantity}</div>
                                                <div className='btn-star' onClick={() => this.handleCreateCollection(item.flashcardsId)}>Thêm vào bộ sưu tập</div>
                                            </div>
                                        </div>
                                        { selectedFlashcardId === item.flashcardsId && <div className='errMessage'>{message}</div> }
                                    </div>
                                        
                                    ))
                                ) : (
                                    <div className='no-results'>Không có kết quả tìm kiếm</div>
                                )
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
