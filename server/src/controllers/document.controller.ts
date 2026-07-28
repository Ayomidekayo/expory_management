import {
  Request,
  Response,
  NextFunction,
} from "express";

import documentService from "../services/document.service";

import {
  createDocumentSchema,
  updateDocumentSchema,
} from "../validations/document.validation";

import {
  DocumentQueryDto,
} from "../validations/document-query.validation";

class DocumentController {
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
      if (!req.file) {
        throw new Error(
          "Please upload a document."
        );
      }

      const data =
        createDocumentSchema.parse(
          req.body
        );

      const document =
        await documentService.create(
          req.file,
          data
        );

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
  Find All
  =====================================
  */

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query =
        DocumentQueryDto.parse(
          req.query
        );

      const result =
        await documentService.findAll(
          query
        );

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Find By Id
  =====================================
  */

  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const document =
        await documentService.findById(
          id
        );

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Update
  =====================================
  */

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      const data =
        updateDocumentSchema.parse(
          req.body
        );

      const document =
        await documentService.update(
          id,
          data
        );

      res.status(200).json({
        success: true,
        message:
          "Document updated successfully.",
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = String(req.params.id);

      await documentService.delete(id);

      res.status(200).json({
        success: true,
        message:
          "Document deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DocumentController();