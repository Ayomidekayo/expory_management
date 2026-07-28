import { Router } from "express";

import transitController from "../controllers/transit.controller";

import {
  createTransitSchema,
  updateTransitSchema,
} from "../validations/transit.validation";

import {
  TransitQueryDto,
} from "../validations/transit-query.validation";
import { validate } from "../middleware/validate";

const router = Router();

/*
=====================================
Create
=====================================
*/

router.post(
  "/",
  transitController.create
);

router.patch(
  "/:id",
  transitController.update
);

/*
=====================================
Find All
=====================================
*/

router.get(
  "/",
  transitController.findAll
);

/*
=====================================
Find By Id
=====================================
*/

router.get(
  "/:id",
  transitController.findById
);

/*
=====================================
Update
=====================================
*/


/*
=====================================
Delete
=====================================
*/

router.delete(
  "/:id",
  transitController.delete
);

export default router;