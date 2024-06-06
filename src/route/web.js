import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD); // giao dien tao

    router.post('/post-crud', homeController.postCRUD); // tao
    router.get('/get-crud', homeController.displayGetCRUD); // hien thu 

    router.get('/edit-crud', homeController.getEditCRUD); // chinh sua
    router.post('/put-crud', homeController.putCRUD); // update

    router.get('/delete-crud', homeController.deleteCRUD); // xoa, su dung method get doi voi lien ket

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);

    router.post('/api/create-flashcards', flashcardController.handleCreateFlashcard);

    return app.use("/", router);
}

module.exports = initWebRoutes;