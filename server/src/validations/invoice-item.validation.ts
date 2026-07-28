// import { z } from "zod";

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

import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional()
);

const optionalNumber = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().optional()
);

export const createInvoiceItemSchema =
  z.object({
    invoiceId: z.string().uuid(),

    description: z.string().min(1),

    hsCode: optionalString,

    packageType: optionalString,

    packages: optionalNumber,

    grossWeight: optionalNumber,

    netWeight: optionalNumber,

    quantity: z.coerce.number(),

    unit: optionalString,

    unitPrice: z.coerce.number(),

    remarks: optionalString,
  });

export const updateInvoiceItemSchema =
  createInvoiceItemSchema
    .omit({
      invoiceId: true,
    })
    .partial();

export type CreateInvoiceItemDto =
  z.infer<typeof createInvoiceItemSchema>;

export type UpdateInvoiceItemDto =
  z.infer<typeof updateInvoiceItemSchema>;