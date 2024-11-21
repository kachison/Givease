import prisma from "@/utils/config/prisma.config";
import { ProductRequestStatus } from "@/utils/helpers/enum.helpers";
import {
  __util_GetActiveSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";

export async function getDonorProductsRecord() {
  const products = await prisma.product.findMany({
    where: {
      requests: {
        some: { status: ProductRequestStatus.AwaitingDonor },
      },
    },
    include: {
      _count: {
        select: {
          requests: {
            where: { status: ProductRequestStatus.AwaitingDonor },
          },
        },
      },
      images: true,
      merchant: true,
    },
  });

  return products;
}

export default async function ListDonorProducts(
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

    const products = await getDonorProductsRecord();

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
