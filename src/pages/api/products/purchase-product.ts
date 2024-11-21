import { Environment } from "@/utils/config/environment.config";
import { paystack } from "@/utils/config/paystack.config";
import prisma from "@/utils/config/prisma.config";
import { Routes } from "@/utils/config/routes.config";
import { ProductRequestStatus } from "@/utils/helpers/enum.helpers";
import {
  __util_GetActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { __util__ZodParser } from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";

export const purchaseProductDtoSchema = z.object({
  requestId: z.string(),
});

export type PurchaseProductDto = TypeOf<typeof purchaseProductDtoSchema>;

export async function assignDonorToProductRequest(
  dto: PurchaseProductDto,
  user: TActiveUserSession
) {
  const productRequest = await prisma.productRequest.update({
    where: { id: dto.requestId },
    data: {
      status: ProductRequestStatus.AwaitingDonorPayment,
      donor: {
        connect: {
          id: user?.donor?.id,
        },
      },
    },
    include: {
      product: true,
    },
  });

  return productRequest;
}

export default async function PurchaseProductHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Donor,
    });

    const dto = await __util__ZodParser(
      purchaseProductDtoSchema.parseAsync(req.body)
    );

    const productRequest = await assignDonorToProductRequest(dto, user);

    const checkout = await paystack.transaction.initialize({
      amount: (productRequest.product.price * 100).toString(),
      email: user?.identifier!,
      metadata: {
        productRequestId: productRequest.id,
      },
      callback_url: Environment.BaseUrl + Routes.Donor.Contributions,
    });

    res.status(200).json({
      message:
        "Your product purchase request has been granted successfully. You will be redirected to check out",
      data: checkout,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while acknowledging your request, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
