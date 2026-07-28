
import fs from "fs";
import path from "path";
import allocationDocumentRepository from "../Repository/allocation-document.repository";

class AllocationDocumentService {
  async create(data: any) {
    return allocationDocumentRepository.create(data);
  }

  async list(allocationId: string) {
    return allocationDocumentRepository.findByAllocation(allocationId);
  }

  async delete(id: string) {
    const doc = await allocationDocumentRepository.findById(id);

    if (doc?.fileUrl) {
  const filePath = path.join(
    process.cwd(),
    doc.fileUrl
  );

  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
}
    return allocationDocumentRepository.delete(id);
  }
}

export default new AllocationDocumentService();
