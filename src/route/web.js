import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import setFlashcardController from "../controllers/setFlashcardController";
import flashcardController from "../controllers/flashcardController";
import collectionController from "../controllers/collectionController";

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

    router.post('/api/signup', userController.handleSignup);

    router.post('/api/edit-user', userController.handleEditUser);
    router.post('/api/delete-user', userController.handleDeleteUser);

    router.post('/api/create-flashcards', setFlashcardController.handleCreateFlashcards);
    router.post('/api/create-flashcard', flashcardController.handleCreateFlashcard);

    router.get('/api/get-all-flashcards', setFlashcardController.handleGetAllFlashcards);
    router.get('/api/get-a-flashcards', flashcardController.handleGetOneFlashcards);

    router.post('/api/delete-flashcards', setFlashcardController.handleDeleteFlashcards);

    router.get('/api/search', setFlashcardController.handleSearch);

    router.post('/api/create-collection', collectionController.collectionFlashcards);
    router.post('/api/display-collection', collectionController.getAllCollection);
    router.post('/api/delete-collection', collectionController.delCollection);
    
    return app.use("/", router);
}

module.exports = initWebRoutes;