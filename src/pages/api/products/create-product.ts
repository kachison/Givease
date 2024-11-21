import prisma from "@/utils/config/prisma.config";
import {
  __util_GetActiveSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { __util__ZodParser } from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";

const createProductDtoSchema = z.object({
  name: z.string({
    required_error: "Missing value of product name in request body",
    invalid_type_error: "Invalid value of product name in request body",
  }),
  description: z.string({
    required_error: "Missing value of product description in request body",
    invalid_type_error: "Invalid value of product description in request body",
  }),
  address: z.string({
    invalid_type_error:
      "Invalid value of product pickup address in request body",
  }),
  images: z
    .array(
      z.object({
        id: z
          .string({
            required_error: "Missing value of product image in request body",
            invalid_type_error:
              "Invalid value of product image in request body",
          })
          .min(1, "Invalid value of product image in request body"),
        url: z
          .string({
            required_error: "Missing value of product image in request body",
            invalid_type_error:
              "Invalid value of product image in request body",
          })
          .url("Invalid value of product image in request body"),
      })
    )
    .min(1, "At least one image is required to upload a product"),
  price: z.number({
    required_error: "Missing value of product price in request body",
    invalid_type_error: "Invalid value of product price in request body",
  }),
});

export type CreateProductDto = TypeOf<typeof createProductDtoSchema>;

export async function createProductRecord(payload: {
  dto: CreateProductDto;
  merchantId: string;
}) {
  const product = await prisma.product.create({
    data: {
      name: payload.dto.name,
      price: payload.dto.price,
      merchantId: payload.merchantId,
      details: payload.dto.description,
      pickupAddress: payload?.dto?.address,
      images: {
        createMany: {
          data: payload.dto.images.map((image) => ({
            remoteLink: image.url,
            remoteId: image.id,
          })),
        },
      },
    },
  });

  return product;
}

export default async function CreateProductHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Merchant,
    });

    const dto = await __util__ZodParser(
      createProductDtoSchema.parseAsync(req.body)
    );
    const product = await createProductRecord({
      dto,
      merchantId: user!.merchant!.id,
    });
    res.status(200).json({
      message: "Your product has been created successfully",
      data: product,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while uploading this product, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
