import prisma from "@/utils/config/prisma.config";
import {
  __util_GetActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { __util__ZodParser } from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";
import crypto from "node:crypto";
import {
  NotificationAction,
  ProductRequestStatus,
} from "@/utils/helpers/enum.helpers";

export const createRequestDtoSchema = z.object({
  productId: z
    .string({
      invalid_type_error: "Invalid value of product id in request body",
      required_error: "Missing value of product id in request body",
    })
    .min(1, "Missing value of product id in request body"),
  title: z
    .string({
      invalid_type_error: "Invalid value of request title in request body",
      required_error: "Missing value of request title in request body",
    })
    .min(1, "Missing value of request title in request body"),
  details: z.string({
    invalid_type_error: "Invalid value of request details in request body",
    required_error: "Missing value of request details in request body",
  }),
});

export type CreateRequestDto = TypeOf<typeof createRequestDtoSchema>;

export async function createRequestRecord(
  dto: CreateRequestDto,
  user: TActiveUserSession
) {
  return await prisma.$transaction(async () => {
    const productRequest = await prisma.productRequest.create({
      data: {
        details: dto.details,
        title: dto.title,
        productId: dto.productId,
        status: ProductRequestStatus.AwaitingDonor,
        requestId: crypto.randomBytes(3).toString("hex").toUpperCase(),
        beneficiaryId: user?.beneficiary?.id!,
      },
      include: {
        product: {
          include: {
            merchant: true,
          },
        },
      },
    });

    await prisma.merchantNotification.create({
      data: {
        merchantId: productRequest.product.merchant.id,
        action: NotificationAction.View,
        title: `${user?.beneficiary?.firstName} ${user?.beneficiary?.lastName} just made a request for a package.`,
        metadata: JSON.stringify({ requestId: productRequest.id }),
      },
    });

    return productRequest;
  });
}

export default async function CreateRequestHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Beneficiary,
    });
    const dto = await __util__ZodParser(
      createRequestDtoSchema.parseAsync(req.body)
    );
    const existingRequests = await prisma.productRequest.findFirst({
      where: {
        beneficiaryId: user?.beneficiary?.id!,
      },
    });

    if (existingRequests) {
      throw new InternalError(
        "You are only allowed one product request. Please try again at a later time."
      );
    }

    const productRequest = await createRequestRecord(dto, user);
    res.status(200).json({
      message: "Your product request has been sent successfully!",
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
