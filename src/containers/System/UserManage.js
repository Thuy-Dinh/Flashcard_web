import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import * as actions from '../../store/actions'; 
import Header from '../Header/Header';
import './UserManage.scss';
import { getAllUsers, handleDelUserApi, handleEditUserApi } from '../../services/userService';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: {},
            persistUser: JSON.parse(localStorage.getItem("persist:user"))
        }
    }

    async componentDidMount() {
        this.loadUsers();
    }

    loadUsers = async () => {
        let userInfo = JSON.parse(this.state.persistUser.userInfo);
        let userId = userInfo.id;
        if (userId) {
            let response = await getAllUsers(userId);
            if (response && response.errCode === 0) {
                this.setState({
                    arrUsers: response.users
                });
            }
        }
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            arrUsers: {
                ...prevState.arrUsers,
                [name]: value
            }
        }));
    }

    resetUserFields = () => {
        let arrUsers = this.state.arrUsers;
        let updatedUsers = { ...arrUsers };

        for (let key in updatedUsers) {
            if (key !== 'email') {
                updatedUsers[key] = '';
            }
        }

        this.setState({
            arrUsers: updatedUsers
        });
    }

    handleEditUser = async () => {
        let { email, firstName, lastName, gender, age } = this.state.arrUsers;
        let response = await handleEditUserApi(email, firstName, lastName, gender, age);
        if (response && response.errCode === 0) {
            // Reload the page after successful edit
            window.location.reload();
        } else {
            // Handle error if needed
            console.error('Failed to edit user');
        }
    }

    handleDelUser = async () => {
        let arrUsers = this.state.arrUsers;
        let userEmail = arrUsers.email;
        await handleDelUserApi(userEmail);
        this.props.processLogout();
    }

    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <>
                <Header />
                <div className="user-container">
                    <div className='title text-center'>Quản lí tài khoản</div>
                    <div className="user-content">
                        <form>
                            <div className="input-info">
                                <label htmlFor="inputEmail">Email</label>
                                <input type="email" className="form-control" name="email" placeholder="Email" value={arrUsers.email} readOnly></input>
                            </div>
                            <div className="input-info">
                                <label htmlFor="inputFirstName">First name</label>
                                <input type="text" className="form-control" name="firstName" placeholder="First name" value={arrUsers.firstName} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="input-info">
                                <label htmlFor="inputLastName">Last name</label>
                                <input type="text" className="form-control" name="lastName" placeholder="Last name" value={arrUsers.lastName} onChange={this.handleInputChange}></input>
                            </div>
                            <div className="input-info">
                                <label htmlFor="inputGender">Gender</label>
                                <select name="gender" className="form-control" value={arrUsers.gender} onChange={this.handleInputChange}>
                                    <option value="1">Nam</option>
                                    <option value="0">Nữ</option>
                                </select>
                            </div>
                            <div className="input-info">
                                <label htmlFor="inputAge">Age</label>
                                <input type="text" className="form-control" name="age" placeholder="18" value={arrUsers.age} onChange={this.handleInputChange}></input>
                            </div>
                        </form>
                        <div className='btn-border'>
                            <div className='btn' onClick={this.handleEditUser}>Lưu thông tin chỉnh sửa</div>
                            <div className='btn' onClick={this.handleDelUser}>Xóa tài khoản</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
