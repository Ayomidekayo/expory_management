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

interface DocumentParams {
  id: string;
}

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
      return res.status(400).json({
        success: false,
        message: "Please upload a document.",
      });
    }

    console.log("========== DOCUMENT UPLOAD ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("=====================================");

    const body =
      createDocumentSchema.parse(req.body);

    const document =
      await documentService.create(
        req.file,
        body
      );

    return res.status(201).json({
      success: true,
      message:
        "Document uploaded successfully.",
      data: document,
    });
  } catch (error) {
    console.error(error);
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
        DocumentQueryDto.parse(req.query);

      const result =
        await documentService.findAll(
          query
        );

      return res.status(200).json({
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
    req: Request<DocumentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const document =
        await documentService.findById(
          req.params.id
        );

      return res.status(200).json({
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
    req: Request<DocumentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const body =
        updateDocumentSchema.parse(req.body);

      const document =
        await documentService.update(
          req.params.id,
          body
        );

      return res.status(200).json({
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
    req: Request<DocumentParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await documentService.delete(
        req.params.id
      );

      return res.status(200).json({
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