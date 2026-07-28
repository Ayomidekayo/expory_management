import { Router } from "express";
import consigneeController from "../controllers/consignee.controller";
import authenticate from "../middleware/auth.middleware";


const router = Router();
router.use(authenticate);

router.post("/", consigneeController.create);

router.get("/", consigneeController.findAll);

router.get("/:id", consigneeController.findOne);

router.patch("/:id", consigneeController.update);

router.delete("/:id", consigneeController.delete);

export default router;