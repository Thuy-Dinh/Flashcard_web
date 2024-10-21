import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import Header from '../Auth/hearder';
import './flashcard.scss';
import { handleGetAFlashcardsApi, handleEditFlashcardsApi, handleEditFlashcardApi, handleDelAFlashcardApi, handleCreateFlashcard } from '../../services/flashcardService';

class Flashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flashcardId: '',
            topic: '',
            title: '',
            arrFlashcard: [],
        }
    }

    async componentDidMount() {
        let queryParams = new URLSearchParams(this.props.location.search);
        let flashcardId = queryParams.get('flashcardId');
        let flashcardTopic = queryParams.get('topic');
        let flashcardTitle = queryParams.get('title');
        if (flashcardId) {
            this.setState({ flashcardId, topic: flashcardTopic, title: flashcardTitle });

            let response = await handleGetAFlashcardsApi(flashcardId);
            if (response && response.errCode === 0) {
                this.setState({
                    arrFlashcard: response.flashcard.map(flashcard => ({ ...flashcard, isNew: false }))
                });
            }
        }
    }

    handleOnChangeTopic = (event) => {
        this.setState({
            topic: event.target.value
        });
    }

    handleOnChangeTitle = (event) => {
        this.setState({
            title: event.target.value
        });
    }

    handleOnChangeTerminology = (event, index) => {
        let arrFlashcard = [...this.state.arrFlashcard];
        arrFlashcard[index].terminology = event.target.value;
        this.setState({ arrFlashcard });
    }

    handleOnChangeIdentify = (event, index) => {
        let arrFlashcard = [...this.state.arrFlashcard];
        arrFlashcard[index].identify = event.target.value;
        this.setState({ arrFlashcard });
    }

    handleAddFlashcard = () => {
        const newId = this.state.arrFlashcard.length > 0 ? this.state.arrFlashcard[this.state.arrFlashcard.length - 1].id + 1 : 1;
        this.setState(prevState => ({
            arrFlashcard: [...prevState.arrFlashcard, { id: newId, terminology: '', identify: '', isNew: true }]
        }));
    }

    handleDelAFlashcard = async (index, id) => {
        await handleDelAFlashcardApi(id);

        if (this.state.arrFlashcard.length > 1) {
            const newFlashcards = this.state.arrFlashcard.filter((_, i) => i !== index);
            this.setState({ arrFlashcard: newFlashcards });
        }
    }

    handleUpdate = async () => {
        const { flashcardId, topic, title, arrFlashcard } = this.state;

        await handleEditFlashcardsApi(flashcardId, topic, title);

        for (let flashcard of arrFlashcard) {
            if (flashcard.isNew) {
                await handleCreateFlashcard(flashcardId, flashcard.terminology, flashcard.identify);
            } else {
                await handleEditFlashcardApi(flashcard.id, flashcard.terminology, flashcard.identify);
            }
        }

        this.props.history.push('/library');
    }

    render() {
        let { topic, title, arrFlashcard } = this.state;
        return (
            <>
                <Header />
                <div className='body'>
                    <div className='body-content'>
                        <div className='body-title'>Chỉnh sửa flashcard</div>
                        <div>
                            <div className='col-12 form-group des-input'>
                                <label>Chủ đề</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Nhập chủ đề'
                                    value={topic}
                                    onChange={this.handleOnChangeTopic}
                                />
                            </div>
                            <div className='col-12 form-group des-input'>
                                <label>Tiêu đề</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Nhập tiêu đề'
                                    value={title}
                                    onChange={this.handleOnChangeTitle}
                                />
                            </div>
                            {arrFlashcard && arrFlashcard.map((flashcard, index) => (
                                <div className='flashcard' key={flashcard.id}>
                                    <div className='col-12 des'>
                                        <div className='STT'>{index + 1}</div>
                                        <i
                                            className={`fas fa-trash-alt icon-trash ${arrFlashcard.length <= 1 ? 'disabled' : ''}`}
                                            style={{ cursor: arrFlashcard.length <= 1 ? 'not-allowed' : 'pointer' }}
                                            onClick={() => this.handleDelAFlashcard(index, flashcard.id)}
                                        ></i>
                                    </div>
                                    <div className='form-group flashcard-content'>
                                        <div className='flashcard-input'>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Nhập thuật ngữ'
                                                value={flashcard.terminology}
                                                onChange={(event) => this.handleOnChangeTerminology(event, index)}
                                            />
                                            <label>Thuật ngữ</label>
                                        </div>
                                        <div className='flashcard-input'>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Nhập định nghĩa'
                                                value={flashcard.identify}
                                                onChange={(event) => this.handleOnChangeIdentify(event, index)}
                                            />
                                            <label>Định nghĩa</label>
                                        </div>
                                        <div className='img'>img</div>
                                    </div>
                                </div>
                            ))}
                            <div className='add-flashcard' onClick={this.handleAddFlashcard}>
                                <div>+</div>
                                <div>Thêm thẻ</div>
                            </div>
                            <div className='col-12' style={{ color: 'red', marginTop: 15 }}>{this.state.errMessage}</div>
                            <div className='btn-create' onClick={this.handleUpdate}>Lưu</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    language: state.app.language
});

export default withRouter(connect(mapStateToProps)(Flashcard));
