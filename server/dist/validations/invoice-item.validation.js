"use strict";
// import { z } from "zod";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInvoiceItemSchema = exports.createInvoiceItemSchema = void 0;
// const optionalString = z.preprocess(
//   (value) => (value === "" ? undefined : value),
//   z.string().optional()
// );
// const optionalNumber = z.preprocess(
//   (value) => (value === "" ? undefined : value),
//   z.coerce.number().optional()
// );
// export const createInvoiceItemSchema =
//   z.object({
//     description:
//       z.string().min(1),
//     hsCode:
//       optionalString,
//     packageType:
//       optionalString,
//     packages:
//       optionalNumber,
//     grossWeight:
//       optionalNumber,
//     netWeight:
//       optionalNumber,
//     quantity:
//       z.coerce.number(),
//     unit:
//       optionalString,
//     unitPrice:
//       z.coerce.number(),
//     remarks:
//       optionalString,
//   });
// export const updateInvoiceItemSchema =
//   createInvoiceItemSchema.partial();
// export type CreateInvoiceItemDto =
//   z.infer<
//     typeof createInvoiceItemSchema
//   >;
const zod_1 = require("zod");
const optionalString = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.string().optional());
const optionalNumber = zod_1.z.preprocess((value) => (value === "" ? undefined : value), zod_1.z.coerce.number().optional());
exports.createInvoiceItemSchema = zod_1.z.object({
    invoiceId: zod_1.z.string().uuid(),
    description: zod_1.z.string().min(1),
    hsCode: optionalString,
    packageType: optionalString,
    packages: optionalNumber,
    grossWeight: optionalNumber,
    netWeight: optionalNumber,
    quantity: zod_1.z.coerce.number(),
    unit: optionalString,
    unitPrice: zod_1.z.coerce.number(),
    remarks: optionalString,
});
exports.updateInvoiceItemSchema = exports.createInvoiceItemSchema
    .omit({
    invoiceId: true,
})
    .partial();
