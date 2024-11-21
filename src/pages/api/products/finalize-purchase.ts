import { paystack } from "@/utils/config/paystack.config";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { Environment } from "@/utils/config/environment.config";
import prisma from "@/utils/config/prisma.config";
import { ProductRequestStatus } from "@/utils/helpers/enum.helpers";
export default async function FinalizePaymentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      throw new InternalError("Cannot process request from unknown origin");
    }

    const hash = crypto
      .createHmac("sha512", Environment.PaystackSecretKey)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== signature) {
      throw new InternalError("Cannot process request from unknown origin");
    }

    res.send(200);
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while acknowledging your request, please try again."
    );
    res.status(400).json({ message: err.message });
  }

  if (!req.body.event.startsWith("charge")) {
    throw new InternalError("Cannot process unsupported paystack event");
  }

  const productRequestId = req.body.data.metadata.productRequestId;

  const productRequest = await prisma.productRequest.update({
    where: {
      id: productRequestId,
    },
    data: {
      remoteTransactionId: req.body.data.reference,
      status: ProductRequestStatus.AwaitingPickup,
    },
    include: {
      donor: true,
      benficiary: true,
      product: true,
    },
  });

  // notifications
  // 1. Inform merchant of donor purchase
  await prisma.merchantNotification.create({
    data: {
      action: "",
      metadata: JSON.stringify({ productRequestId }),
      title: `${productRequest.donor?.firstName} ${productRequest.donor?.lastName} just paid for PKG${productRequest.requestId} on behalf of ${productRequest.benficiary.firstName} ${productRequest.benficiary.lastName}`,
      merchantId: productRequest.product.merchantId,
    },
  });

  // 2. inform beneficiary of donor purchase
  await prisma.beneficiaryNotification.create({
    data: {
      action: "",
      metadata: JSON.stringify({ productRequestId }),
      title: `${productRequest.donor?.firstName} ${productRequest.donor?.lastName} just paid for PKG${productRequest.requestId} on your behalf`,
      beneficiaryId: productRequest.beneficiaryId,
    },
  });
}
