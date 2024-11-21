import prisma from "@/utils/config/prisma.config";
import {
  __util_GetActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";

export async function getDonorContributions(user: TActiveUserSession) {
  const productRequests = await prisma.productRequest.findMany({
    where: {
      donorId: user?.donor?.id,
    },
    include: {
      product: {
        include: {
          images: true,
        },
      },
    },
  });

  return productRequests;
}

export default async function ListDonorContributionsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Donor,
    });

    const contributions = await getDonorContributions(user);
    res.status(200).json({
      message: "Product has been fetched successfully",
      data: contributions,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while retrieving your contributions, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
