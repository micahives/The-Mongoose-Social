const express = require('express');
const router = express.Router();
const UserController = require('../controllers/api/userController');

router.get('/', UserController.getUsers);
router.get('/:userId', UserController.getSingleUser);
router.post('/', UserController.createUser);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);
router.post('/:userId/friends/:friendId', UserController.addFriend);
router.delete('/:userId/friends/:friendId', UserController.removeFriend);

module.exports = router;
