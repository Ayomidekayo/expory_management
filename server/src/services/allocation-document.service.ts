import cloudinary from "../config/cloudinary";
import allocationDocumentRepository from "../Repository/allocation-document.repository";

class AllocationDocumentService {
  /*
  =====================================
  Create
  =====================================
  */

  async create(data: any) {
    return allocationDocumentRepository.create(data);
  }

  /*
  =====================================
  List
  =====================================
  */

  async list(allocationId: string) {
    return allocationDocumentRepository.findByAllocation(
      allocationId
    );
  }

  /*
  =====================================
  Delete
  =====================================
  */

  async delete(id: string) {
    const document =
      await allocationDocumentRepository.findById(
        id
      );

    if (!document) {
      throw new Error(
        "Document not found."
      );
    }

    if (document.publicId) {
      await cloudinary.uploader.destroy(
        document.publicId,
        {
          resource_type: "raw",
        }
      );
    }

    return allocationDocumentRepository.delete(
      id
    );
  }
}

export default new AllocationDocumentService();