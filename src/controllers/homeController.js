import db from "../models/index";

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

// Object: {
//     key: "",
//     value: ""
// }

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage
};