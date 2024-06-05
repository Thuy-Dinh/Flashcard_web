import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Header from '../Header/Header';
import './UserManage.scss';
import { getAllUsers } from '../../services/userService';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: {},
            persistUser: JSON.parse(localStorage.getItem("persist:user"))
        }
    }

    async componentDidMount() {
        let userInfo = JSON.parse(this.state.persistUser.userInfo);
        let userId = userInfo.id;
        // console.log(userId);
        if(userId) {
            let response = await getAllUsers(userId);
            if(response && response.errCode === 0) {
                this.setState({
                    arrUsers: response.users
                })
            }
        }
    }


    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <>
                <Header />
                <div className="user-container">
                    <div className='title text-center'>Quản lí tài khoản</div>
                    <div className='user-table mt-4 mx-3'>
                        <table id="customers">
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Gender</th>
                                <th>Age</th>
                                <th>Actions</th>
                            </tr>
                            <tr>
                                <td>{arrUsers.email}</td>
                                <td>{arrUsers.firstName}</td>
                                <td>{arrUsers.lastName}</td>
                                <td>{arrUsers.gender === 1 ? "nam" : "nữ"}</td>
                                <td>{arrUsers.age}</td>
                                <td>
                                    <div className='btn-border'>
                                        <div><i className="fas fa-pencil-alt btn"></i></div>
                                        <div><i className="fas fa-trash btn"></i></div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
