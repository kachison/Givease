import prisma from "@/utils/config/prisma.config";
import { __util_GetActiveSession } from "@/utils/helpers/session.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";

export async function getMerchantProductsRecord(merchantId?: string) {
  return await prisma.product.findMany({
    where: {
      merchantId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: true,
      images: true,
      merchant: {
        select: {
          businessName: true,
          address: true,
        },
      },
    },
  });
}

export default async function ListMerchantProductsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
      // role: UserRole.Merchant,
    });

    const products = await getMerchantProductsRecord(user?.merchant?.id);

    res.status(200).json({
      message: "Your products have been retrieved successfully.",
      data: products,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while retrieving your products, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
