import jwt from "jsonwebtoken";
import prisma from "@/utils/config/prisma.config";
import {
  __util__getIntlPhoneNumber,
  __util__ZodParser,
} from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { hashSync } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";
import * as cookie from "cookie";
import dayjs from "dayjs";
import { UserRole } from "@/utils/helpers/session.helper";
import { Environment } from "@/utils/config/environment.config";
import { IdentifierType } from "@prisma/client";

export const createBeneficiaryDtoSchema = z.object({
  firstName: z
    .string({
      required_error: "Missing value of first name in request body",
      invalid_type_error: "Invalid value of first name in request body",
    })
    .min(3, "Invalid value of first name in request body"),
  lastName: z
    .string({
      required_error: "Missing value of last name in request body",
      invalid_type_error: "Invalid value of last name in request body",
    })
    .min(3, "Invalid value of last name in request body"),
  phoneNumber: z
    .string({
      required_error: "Missing value of phone number in request body",
      invalid_type_error: "Invalid value of phone number in request body",
    })
    .min(10, "Invalid value of phone number in request body")
    .transform((phone, ctx) => {
      let phoneClone = __util__getIntlPhoneNumber(phone);

      if (!phoneClone) {
        ctx.addIssue({
          message: "Invalid value of phone number in request body",
        } as any);
      }

      return phoneClone;
    }),
  password: z
    .string({
      required_error: "Missing value of password in request body",
      invalid_type_error: "Invalid value of password in request body",
    })
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      "Password must be a minimum of 8 characters and must include an uppercase, lowercase and special character."
    ),
});

export type CreateBeneficiaryDto = TypeOf<typeof createBeneficiaryDtoSchema>;

export async function checkForExistingBeneficiary(dto: CreateBeneficiaryDto) {
  const beneficiary = await prisma.user.findFirst({
    where: { identifier: dto.phoneNumber },
  });

  if (beneficiary) {
    throw new InternalError(
      "An account with this phone number already exists. If you own this number, please sign in to your account to continue."
    );
  }
}

export async function createUserAsBeneficiary(dto: CreateBeneficiaryDto) {
  const beneficiaryUser = await prisma.user.create({
    data: {
      identifier: dto.phoneNumber!,
      identifierType: IdentifierType.PHONE,
      meta: {
        create: {
          password: hashSync(dto.password),
        },
      },
      beneficiary: {
        create: {
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      },
    },
  });

  return beneficiaryUser;
}

export default async function CreateBeneficiaryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const dto = await __util__ZodParser(
      createBeneficiaryDtoSchema.parseAsync(req.body)
    );
    await checkForExistingBeneficiary(dto);
    const user = await createUserAsBeneficiary(dto);
    const sessionToken = jwt.sign(
      {
        id: user.id,
        role: UserRole.Beneficiary,
      },
      Environment.JwtSecret,
      { expiresIn: "30d" }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("session_id", sessionToken, {
        httpOnly: true,
        path: "/",
        priority: "high",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        expires: dayjs().add(30, "days").toDate(),
      })
    );

    res.status(200).json({
      message: "Your account has been created successfully",
      data: user,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while provisioning your account, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
