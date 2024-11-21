import prisma from "@/utils/config/prisma.config";
import {
  __util_GetActiveSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { __util__ZodParser } from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";

const findBeneficiaryProductDtoSchema = z.object({
  productId: z.string({
    required_error: "Missing value of product id in request body",
    invalid_type_error: "Invalid value of product id in request body",
  }),
});

export type FindBeneficiaryProductDto = TypeOf<
  typeof findBeneficiaryProductDtoSchema
>;

export async function getBeneficiaryProductRecord(
  dto: FindBeneficiaryProductDto
) {
  const product = prisma.product.findFirst({
    where: { id: dto.productId },
    include: { merchant: true, images: true },
  });

  return product;
}

export default async function FindBeneficiaryProductHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Beneficiary,
    });
    const dto = await __util__ZodParser(
      findBeneficiaryProductDtoSchema.parseAsync(req.query)
    );
    const product = await getBeneficiaryProductRecord(dto);
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
