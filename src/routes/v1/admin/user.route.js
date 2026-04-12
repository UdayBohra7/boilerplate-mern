const { Router } = require("express");
const auth = require("../../../middlewares/auth");
const upload = require("../../../middlewares/multer");
const {
  createUsers,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  hardDeleteUser,
  restoreUser,
  uploadImage,
  getUserStatistics,
} = require("../../../controllers/admin.controller/users.controller");
const validate = require('../../../middlewares/validate');
const userValidation = require('../../../validations/user.validation');
const adminAuth = require("../../../middlewares/adminAuth");

const userRouter = Router();

userRouter.use(adminAuth());

userRouter.route("/statistics").get(getUserStatistics);
userRouter.route("/")
  .get(getUsers)
  .post(upload.single('image'), createUsers);

userRouter.route("/:userId")
  .get(getUser)
  .put(upload.single('image'), validate(userValidation.updateUserAdmin), updateUser)
  .delete(hardDeleteUser);

userRouter.route("/:userId").put(restoreUser);
userRouter.route("/uploadImage/:userId").post(upload.single('image'), uploadImage);


module.exports = userRouter;
