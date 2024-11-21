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

export const updateMerchantDtoSchema = z.object({
  address: z.string({
    required_error: "Missing value of address in request body",
    invalid_type_error: "Invalid value of address in request body",
  }),
});

export type UpdateMerchantDto = TypeOf<typeof updateMerchantDtoSchema>;

export async function updateMerchantProfile(
  dto: UpdateMerchantDto,
  user: TActiveUserSession
) {
  const merchant = await prisma.merchant.update({
    where: {
      userId: user?.id,
    },
    data: {
      address: dto.address,
      identityVerifiedAt: new Date(),
    },
  });
}

export default async function UpdateMerchantHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const dto = await __util__ZodParser(
      updateMerchantDtoSchema.parseAsync(req.body)
    );
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Merchant,
    });

    const merchant = await updateMerchantProfile(dto, user!);

    res.status(200).json({
      message: "Your profile has been updated successfully.",
      data: merchant,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while updating your profile, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
