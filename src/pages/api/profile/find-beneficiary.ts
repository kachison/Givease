import prisma from "@/utils/config/prisma.config";
import {
  __util_GetActiveSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { __util__ZodParser } from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";

const findBeneficiaryDtoSchema = z.object({
  beneficiaryId: z.string({
    required_error: "Missing value of beneficiary id in request body",
    invalid_type_error: "Invalid value of beneficiary id in request body",
  }),
});

export type FindBeneficiaryDto = TypeOf<typeof findBeneficiaryDtoSchema>;

export async function getBeneficiaryRecord(dto: FindBeneficiaryDto) {
  const beneficiary = await prisma.beneficiary.findFirst({
    where: { id: dto.beneficiaryId },
    include: {
      user: true,
    },
  });

  return beneficiary;
}

export default async function FindBeneficiaryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await __util_GetActiveSession(req.cookies, {
      // strict: true,
      role: UserRole.Donor,
    });
    const dto = await __util__ZodParser(
      findBeneficiaryDtoSchema.parseAsync(req.query)
    );
    const product = await getBeneficiaryRecord(dto);
    res.status(200).json({
      message: "Beneficiary profile has been fetched successfully",
      data: product,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while retrieving this profile, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
