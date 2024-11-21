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

export const approveProductRequestDtoSchema = z.object({
  requestId: z.string({
    required_error: "Missing value of request id in request body",
    invalid_type_error: "Invalid value of request id in request body",
  }),
});

export type ApproveProductRequestDto = TypeOf<
  typeof approveProductRequestDtoSchema
>;

export async function updateProductRequest(dto: ApproveProductRequestDto) {
  const productRequest = await prisma.productRequest.update({
    where: {
      id: dto.requestId,
    },
    data: {
      status: ProductRequestStatus.Claimed,
    },
    include: {
      benficiary: true,
    },
  });

  await prisma.donorNotification.create({
    data: {
      action: "",
      title: `${productRequest.benficiary.firstName} ${productRequest.benficiary.lastName} has claimed their package.`,
      metadata: "",
      donorId: productRequest.donorId!,
    },
  });

  return productRequest;
}

export default async function ApproveProductRequestHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Merchant,
    });

    const dto = await __util__ZodParser(
      approveProductRequestDtoSchema.parseAsync(req.body)
    );

    const productRequest = await updateProductRequest(dto);

    res.status(200).json({
      message: "Product has been claimed successfully!",
      data: productRequest,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while acknowledging your request, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
