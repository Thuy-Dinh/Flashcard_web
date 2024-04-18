import db from "../models/index";
import CRUDService from "../services/CRUDService";

// nhung xu ly lien quan den db hoac mat tgian thi su dung async, await hoac 
// Promise hoac ca hai (su ly bat dong bo)

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }
};

let getAboutPage = async (req, res) => {
    return res.render('test/about.ejs');
};

let getCRUD = async (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('post crud from server');
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    // console.log('..................');
    // console.log(data);
    // console.log('..................');
    return res.render('displayCRUD.ejs', {
        dataTable: data,
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let dataUser = await CRUDService.getDataInfoById(userId);
        // console.log('---------------');
        // console.log(dataUser);
        // console.log('---------------');
        return res.render('editCRUD.ejs', {
            user: dataUser // user <- dataUser
        });
    }
    else {
        return res.send('Users not found');

    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data);
    return res.redirect("/get-crud");
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send('delete user successful!');
    }
    else {
        return res.send('id user not found!');
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
};