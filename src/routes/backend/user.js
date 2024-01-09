
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

const path = require('path');
// const session = require('express-session')
// const config = require('../../configs/config')


const UserController = require('../../controllers/backend/user_controller')

const multer = require('multer');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}))

router.use(express.static('public'))

router
    .route('/contact')
    .post(UserController.contact)

module.exports = router;    