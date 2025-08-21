const express = require("express");
const adminController = require("../controllers/adminController");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/dashboard", adminController.dashboardShow);
router.post("/logout", adminController.logout);
router.get("/settings", adminController.settingsShow);
router.post("/editProfile", adminController.editProfile);
router.post("/deleteAccount", adminController.deleteAccount);
router.get("/users", adminController.usersShow);
router.post("/usersDelete/:id", adminController.usersDelete);

router.get("/slider", adminController.sliderShow);

router.get("/filters", adminController.filtersShow);
router.get("/filtersAdd", adminController.filtersAddShow);
router.post("/filtersAdd", adminController.filtersAdd);
router.get("/filters/:id/edit", adminController.filtersEditShow);
router.post("/filters/:id/edit", adminController.filtersEdit);
router.post("/filters/:id/delete", adminController.filtersDelete);

router.get("/size", adminController.sizeShow);
router.get("/sizeAdd", adminController.sizeAddShow);
router.post("/sizeAdd", adminController.sizeAdd);
router.get("/size/:id/edit", adminController.sizeEditShow);
router.post("/size/:id/edit", adminController.sizeEdit);
router.post("/size/:id/delete", adminController.sizeDelete);

router.get("/color", adminController.colorShow);
router.get("/colorAdd", adminController.colorAddShow);
router.post("/colorAdd", adminController.colorAdd);
router.get("/color/:id/edit", adminController.colorEditShow);
router.post("/color/:id/edit", adminController.colorEdit);
router.post("/color/:id/delete", adminController.colorDelete);

router.get("/sliderAdd", adminController.sliderAddShow);
router.post(
  "/sliderAdd",
  uploadMiddleware.fields([
    { name: "imageMobile", maxCount: 3 },
    { name: "imageWeb", maxCount: 3 },
  ]),
  adminController.sliderAdd
);
router.get("/slider/:id/edit", adminController.sliderEditShow);
router.post(
  "/slider/:id/edit",
  uploadMiddleware.fields([
    { name: "imageMobile", maxCount: 3 },
    { name: "imageWeb", maxCount: 3 },
  ]),
  adminController.sliderEdit
);
router.post("/slider/:id/delete", adminController.sliderDelete);

router.get("/stores", adminController.storesShow);
router.get(
  "/storesAdd",
  uploadMiddleware.single("image"),
  adminController.storesAddShow
);
router.post(
  "/storesAdd",
  uploadMiddleware.single("image"),
  adminController.storesAdd
);
router.get("/storesEdit/:id", adminController.storesEditShow);
router.post(
  "/storesEdit/:id",
  uploadMiddleware.single("image"),
  adminController.storesEdit
);
router.post("/storesDelete/:id", adminController.storesDelete);

router.get("/orders", adminController.orders);
router.post("/approve/:aid", adminController.approve);
router.post("/reject/:aid", adminController.reject);

router.get("/getSub/:mainId", adminController.getSub);
router.get("/getProducts/:categoryId", adminController.getProducts);

module.exports = router;
