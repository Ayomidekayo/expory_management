import { Request, Response, NextFunction } from "express";

import allocationDocumentService from "../services/allocation-document.service";
import { createAllocationDocumentSchema } from "../validations/allocation.document.validation";

class AllocationDocumentController {
  /*
  =====================================
  Upload Document
  =====================================
  */

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const allocationId = String(req.params.id);

      const body =
        createAllocationDocumentSchema.parse(
          req.body
        );

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Document is required.",
        });
      }

      const document =
        await allocationDocumentService.create({
          allocationId,

          type: body.type,

          remarks: body.remarks,

          fileName: req.file.filename,

          originalName: req.file.originalname,

          fileUrl: `/uploads/allocations/${req.file.filename}`,

          mimeType: req.file.mimetype,

          extension:
            req.file.originalname
              .split(".")
              .pop(),

          fileSize: req.file.size,

          uploadedById:
            req.user?.id ?? null,
        });

      res.status(201).json({
        success: true,
        message:
          "Document uploaded successfully.",
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Allocation Documents
  =====================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const allocationId = String(req.params.id);

      const documents =
        await allocationDocumentService.list(
          allocationId
        );

      res.json({
        success: true,
        data: documents,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete Document
  =====================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const documentId = String(
        req.params.documentId
      );

      await allocationDocumentService.delete(
        documentId
      );

      res.json({
        success: true,
        message:
          "Document deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AllocationDocumentController();