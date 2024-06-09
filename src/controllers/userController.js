import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // check email exist
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Các trường dữ liệu không được để trống!'
        });
    }

    let userData = await userService.handleUserLogin(email, password);
    console.log(userData);

    // return user info
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    });
};

let handleGetAllUsers = async(req, res) => {
    let id = req.query.id; // All, Single(sửa)

    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Các trường dữ liệu không được để trống!',
            users: []
        })
    }

    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users
    })
}

let handleSignup = async(req, res) => {
    let userName = req.body.userName;
    let email = req.body.email;
    let password = req.body.password;

    // check email exist
    if (!userName || !email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Các trường dữ liệu không được để trống!'
        });
    }

    let userCreated = await userService.handleUserSignup(userName, email, password);
    console.log(userCreated);

    // return user info
    return res.status(200).json({
        errCode: userCreated.errCode,
        message: userCreated.errMessage,
        user: userCreated.user ? userCreated.user : {}
    });
}

let handleEditUser = async (req, res) => {
    // Log dữ liệu nhận từ request
    console.log('Request body:', req.body);

    let email = req.body.email;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let gender = req.body.gender;
    let age = req.body.age;

    if (!email) {
        return res.status(500).json({
            errCode: 1,
            message: 'Không tìm thấy email người dùng!'
        });
    }
    
    try {
        // Log các tham số truyền vào dịch vụ
        console.log('Calling handleEdit with:', { email, firstName, lastName, gender, age });
        
        let userUpdated = await userService.handleEdit(email, firstName, lastName, gender, age);
        
        // Log kết quả trả về từ dịch vụ
        console.log('Edit result:', userUpdated);

        return res.status(200).json({
            errCode: userUpdated.errCode,
            message: userUpdated.errMessage,
            user: userUpdated.user 
        });
    } catch (error) {
        // Log lỗi nếu có
        console.error('Error in handleEditUser:', error);
        return res.status(500).json({
            errCode: 2,
            message: 'Có lỗi xảy ra trong quá trình chỉnh sửa người dùng!'
        });
    }
}

let handleDeleteUser = async(req, res) => {
    let email = req.body.email;

    if (!email) {
        return res.status(500).json({
            errCode: 1,
            message: 'Không tìm thấy email người dùng!'
        });
    }

    let userDeleted = await userService.handleDelete(email);
    console.log(userDeleted);

    return res.status(200).json({
        errCode: userDeleted.errCode,
        message: userDeleted.errMessage,
        user: userDeleted.user 
    });
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleSignup: handleSignup,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser
};
