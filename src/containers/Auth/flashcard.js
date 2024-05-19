import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions"; //redux
import './flashcard.scss';
import Header from '../Header/Header';
import { FormattedMessage } from 'react-intl';

class Flashcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topic: '',
            title: '',
            terminology: '',
            identify: '',
            flashcards: [
                { id: 1, terminology: '', identify: '' },
                // { id: 2, terminology: '', identify: '' }
            ]
        }
    }

    handleOnChangeTopic = (event) => {
        this.setState({
            topic: event.target.value
        })
    }

    handleOnChangeTitle = (event) => {
        this.setState({
            title: event.target.value
        })
    }

    handleAddFlashcard = () => {
        this.setState(prevState => ({
            flashcards: [...prevState.flashcards, { terminology: '', identify: '' }]
        }));
    }

    handleOnChangeTerminology = (event) => {
        this.setState({
            terminology: event.target.value
        })
    }

    handleOnChangeIdentify = (event) => {
        this.setState({
            identify: event.target.value
        })
    }

    handleRemoveFlashcard = (index) => {
        if (this.state.flashcards.length > 1) {
            const newFlashcards = this.state.flashcards.filter((_, i) => i !== index);
            this.setState({ flashcards: newFlashcards });
        }
    }

    handleCreate = () => {
        console.log('topic: ', this.state.topic, 'title: ', this.state.title)
        console.log('all state: ', this.state)
    }

    render() {
        return (
            <>
                <div className='header'>
                    <Header />
                </div>
                <div className='body'>
                    <div className='body-content'>
                        <div className='body-title'>Tạo bộ flashcard mới</div>
                        <div>
                            <div className='col-12 form-group des-input'>
                                <label>Chủ đề</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Nhập chủ đề'
                                    value={this.state.topic}
                                    onChange={(event) => this.handleOnChangeTopic(event)}
                                />
                            </div>
                            <div className='col-12 form-group des-input'>
                                <label>Tiêu đề</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Nhập tiêu đề'
                                    value={this.state.title}
                                    onChange={(event) => this.handleOnChangeTitle(event)}
                                />
                            </div>
                            {this.state.flashcards.map((flashcard, index) => (
                                <div className='flashcard' key={index}>
                                    <div className='col-12 des'>
                                        <div className='STT'>{index + 1}</div>
                                        <i
                                            className={`fas fa-trash-alt icon-trash ${this.state.flashcards.length <= 1 ? 'disabled' : ''}`}
                                            onClick={() => this.handleRemoveFlashcard(index)}
                                            style={{ cursor: this.state.flashcards.length <= 1 ? 'not-allowed' : 'pointer' }}
                                        ></i>
                                    </div>
                                    <div className='form-group flashcard-content'>
                                        <div className='flashcard-input'>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Nhập thuật ngữ'
                                                value={flashcard.terminology}
                                                onChange={(event) => {
                                                    const newFlashcards = [...this.state.flashcards];
                                                    newFlashcards[index].terminology = event.target.value;
                                                    this.setState({ flashcards: newFlashcards });
                                                }}
                                            />
                                            <label>Thuật ngữ</label>
                                        </div>
                                        <div className='flashcard-input'>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Nhập định nghĩa'
                                                value={flashcard.identify}
                                                onChange={(event) => {
                                                    const newFlashcards = [...this.state.flashcards];
                                                    newFlashcards[index].identify = event.target.value;
                                                    this.setState({ flashcards: newFlashcards });
                                                }}
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
                            <div className='btn-create' onClick={() => { this.handleCreate() }}>Tạo</div>
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

// const mapDispatchToProps = dispatch => {
//     return {
//         navigate: (path) => dispatch(push(path)),
//         adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
//         adminLoginFail: () => dispatch(actions.adminLoginFail()),
//     };
// };

export default connect(mapStateToProps)(Flashcard);
