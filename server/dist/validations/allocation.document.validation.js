"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAllocationDocumentSchema = void 0;
const zod_1 = require("zod");
const generated_1 = require("../generated");
exports.createAllocationDocumentSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(generated_1.DocumentType),
    remarks: zod_1.z.string().optional(),
});
