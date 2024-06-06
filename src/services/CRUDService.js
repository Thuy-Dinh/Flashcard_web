import bcrypt from 'bcrypt'; // su dung de bam password
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);


let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({ // function cua sequlize
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender === '1' ? true : false,
                age: data.age,
            })

            resolve('ok! create a new user successful!');

        } catch (e) {
            reject(e);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
            // bcrypt.compare(myPlaintextPassword, hash, function(e, result) {
            //     // result == true
            // });
            // bcrypt.compare(someOtherPlaintextPassword, hash, function(e, result) {
            //     // result == false
            // });
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true, // hien thi du lieu goc
            }); // function cua sequlize
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let getDataInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ // function cua sequlize
                where: { id: userId },
                raw: true
            })

            if (user) {
                resolve(user);
            }
            else {
                resolve({});
            }

        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = async(data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.gender = data.gender;
                user.age = data.age;

                await user.save();
                resolve();
            }
            else {
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User;
            await user.destroy({
                where: { id: userId }
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getDataInfoById: getDataInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}