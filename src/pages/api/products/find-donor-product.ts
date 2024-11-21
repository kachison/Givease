import prisma from "@/utils/config/prisma.config";
import { ProductRequestStatus } from "@/utils/helpers/enum.helpers";
import {
  __util_GetActiveSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { __util__ZodParser } from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";

const findDonorProductDtoSchema = z.object({
  productId: z.string({
    required_error: "Missing value of product id in request body",
    invalid_type_error: "Invalid value of product id in request body",
  }),
});

export type FindDonorProductDto = TypeOf<typeof findDonorProductDtoSchema>;

export async function getDonorProductRecord(dto: FindDonorProductDto) {
  const product = prisma.product.findFirst({
    where: { id: dto.productId },
    include: {
      merchant: true,
      images: true,
      requests: {
        where: { status: ProductRequestStatus.AwaitingDonor },
        include: {
          benficiary: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return product;
}

export default async function FindDonorProductHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Donor,
    });
    const dto = await __util__ZodParser(
      findDonorProductDtoSchema.parseAsync(req.query)
    );
    const product = await getDonorProductRecord(dto);
    res.status(200).json({
      message: "Product has been fetched successfully",
      data: product,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while retrieving this product, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
