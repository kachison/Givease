import prisma from "@/utils/config/prisma.config";
import {
  __util_GetActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { __util__ZodParser } from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";
import { date, TypeOf, z } from "zod";

export const updateBeneficiaryDtoSchema = z.object({
  gender: z.enum(["male", "female"], {
    errorMap: () => new Error("Invalid value of gender in request body"),
  }),
  address: z.string({
    required_error: "Missing value of address in request body",
    invalid_type_error: "Invalid value of address in request body",
  }),
  numberOfKids: z.string({
    required_error: "Missing value of kids in request body",
    invalid_type_error: "Invalid value of kids in request body",
  }),
  bio: z.string({
    required_error: "Missing value of bio in request body",
    invalid_type_error: "Invalid value of bio in request body",
  }),
  occupation: z.string({
    required_error: "Missing value of occupation in request body",
    invalid_type_error: "Invalid value of occupation in request body",
  }),
  educationLevel: z.string({
    required_error: "Missing value of education level in request body",
    invalid_type_error: "Invalid value of education level in request body",
  }),
  passport: z.string({
    required_error: "Missing value of passport in request body",
    invalid_type_error: "Invalid value of passport in request body",
  }),
  identificationNumber: z.string({
    required_error: "Missing value of identification number in request body",
    invalid_type_error:
      "Invalid value of identification number in request body",
  }),
  source: z.string({
    required_error: "Missing value of source in request body",
    invalid_type_error: "Invalid value of source in request body",
  }),
});

export type UpdateBeneficiaryDto = TypeOf<typeof updateBeneficiaryDtoSchema>;

export async function updateBeneficiaryProfile(
  dto: UpdateBeneficiaryDto,
  user: TActiveUserSession
) {
  const beneficiary = await prisma.beneficiary.update({
    where: {
      userId: user?.id,
    },
    data: {
      address: dto.address,
      bio: dto.bio,
      educationLevel: dto.educationLevel,
      gender: dto.gender,
      identityVerifiedAt: new Date(),
      numberOfKids: dto.numberOfKids,
      occupation: dto.occupation,
      passport: dto.passport,
      source: dto.source,
    },
  });
}

export default async function UpdateBeneficiaryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const dto = await __util__ZodParser(
      updateBeneficiaryDtoSchema.parseAsync(req.body)
    );
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
      role: UserRole.Beneficiary,
    });
    const beneficiary = await updateBeneficiaryProfile(dto, user!);
    res.status(200).json({
      message: "Your profile has been updated successfully.",
      data: beneficiary,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while updating your profile, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
