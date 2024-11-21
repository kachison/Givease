import prisma from "@/utils/config/prisma.config";
import {
  __util_GetActiveSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";

export async function getMerchantProductRequests(merchantId: string) {
  const productRequests = await prisma.productRequest.findMany({
    where: { product: { merchantId } },
    include: {
      product: {
        include: {
          images: true,
        },
      },
      benficiary: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return productRequests;
}

export default async function ListMerchantRequestsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Merchant,
    });

    const productRequests = await getMerchantProductRequests(
      user?.merchant?.id!
    );

    res.status(200).json({
      message: "Your product requests have been retrieved successfully.",
      data: productRequests,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while retrieving your products, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
