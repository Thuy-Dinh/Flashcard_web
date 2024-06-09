import bcrypt from 'bcrypt'; // sử dụng để băm mật khẩu
import db from "../models/index";
import { raw } from 'body-parser';

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['id', 'email', 'firstName', 'lastName', 'password'],
                    raw: true
                });

                if (user) {
                    let check = await bcrypt.compare(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';

                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Sai mật khẩu';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `Người dùng không hợp lệ`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Email không tồn tại. Hãy thử email khác`;
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            });

            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = '';
            if(userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            } 
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {
                        id: userId, 
                    },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let handleUserSignup = (userName, userEmail, userPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(userEmail);
            if (!isExist) {
                let password = await hashUserPassword(userPassword);
                let user = await db.User.create({
                    email: userEmail,
                    password: password,
                    firstName: userName,
                    lastName: '',
                    gender: '',
                    age: '',
                    img: ''
                });
                userData.errCode = 0;
                userData.errMessage = 'ok';
                userData.user = user;
            } else {
                userData.errCode = 1;
                userData.errMessage = `Email đã tồn tại. Hãy thử email khác`;
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleEdit = (useEmail, useFirstName, userLastName, userGender, userAge) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userUpdated = {};
            
            // Log các tham số đầu vào
            console.log('handleEdit called with:', { useEmail, useFirstName, userLastName, userGender, userAge });

            let user = await db.User.findOne({
                where: { email: useEmail },
                raw: false
            });

            // Log kết quả tìm kiếm user
            console.log('User found:', user);

            if (user) {
                user.email = useEmail;
                user.firstName = useFirstName;
                user.lastName = userLastName;
                user.gender = userGender;
                user.age = userAge;

                userUpdated.user = await user.save();

                // Log user sau khi cập nhật
                console.log('User updated:', userUpdated.user);

                userUpdated.errCode = 0;
                userUpdated.errMessage = 'ok';
            } else {
                userUpdated.errCode = 1;
                userUpdated.errMessage = 'Email không hợp lệ';
                
                // Log trường hợp user không được tìm thấy
                console.log('User not found with email:', useEmail);
            }

            resolve(userUpdated);

        } catch (e) {
            // Log lỗi
            console.error('Error in handleEdit:', e);
            reject(e);
        }
    });
};


let handleDelete = (useEmail) => {
    return new Promise(async(resolve, reject) => {
        try {
            let userDel = {};
            let user = await db.User.findOne({
                where: { email: useEmail },
                raw: false
            })
            let userId = user.id;
            console.log(userId);
            await handleDelAllFlashcards(userId);
            
            userDel.errCode = 0;
            userDel.errMessage = 'ok';
            userDel.user = await user.destroy();

            resolve(userDel);

        } catch (e) {
            reject(e);
        }
    })
}

let handleDelAllFlashcards = (id) => {
    return new Promise( async(resolve, reject) => {
        try {
            let flashcards = await db.Setflashcard.findOne({
                where: { userId: id },
                raw: false
            })

            let flashcardsId = flashcards.id;
            console.log(flashcardsId);

            await handleDelAllFlashcard(flashcardsId);

            await flashcards.destroy();
    
            resolve();
            
        } catch (e) {
            reject(e)
        }
    })
}

let handleDelAllFlashcard = (id) => {
    return new Promise( async(resolve, reject) => {
        try {
            await db.Flashcard.destroy({
                where: { setFlashcardId: id }
            })
                
            resolve();
            
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    handleUserSignup: handleUserSignup,
    handleEdit: handleEdit,
    handleDelete: handleDelete
};
