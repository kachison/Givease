import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import prisma from "@/utils/config/prisma.config";
import { __util__ZodParser } from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { IdentifierType } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";
import { UserRole } from "@/utils/helpers/session.helper";
import { Environment } from "@/utils/config/environment.config";
import dayjs from "dayjs";

export const createDonorDtoSchema = z.object({
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
  emailAddress: z
    .string({
      required_error: "Missing value of phone number in request body",
      invalid_type_error: "Invalid value of phone number in request body",
    })
    .email("Invalid value of email address in request body"),
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

export type CreateDonorDto = TypeOf<typeof createDonorDtoSchema>;

export async function checkForExistingDonor(dto: CreateDonorDto) {
  const donor = await prisma.user.findFirst({
    where: { identifier: dto.emailAddress },
  });

  if (donor) {
    throw new InternalError(
      "An account with this email address already exists. If you own this email address, please sign in to your account to continue."
    );
  }
}

export async function createUserAsDonor(dto: CreateDonorDto) {
  const donor = await prisma.user.create({
    data: {
      identifier: dto.emailAddress,
      identifierType: IdentifierType.EMAIL,
      meta: {
        create: {
          password: hashSync(dto.password),
        },
      },
      donor: {
        create: {
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      },
    },
  });

  return donor;
}

export default async function CreateDonorHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const dto = await __util__ZodParser(
      createDonorDtoSchema.parseAsync(req.body)
    );
    await checkForExistingDonor(dto);
    const user = await createUserAsDonor(dto);
    const sessionToken = jwt.sign(
      {
        id: user.id,
        role: UserRole.Donor,
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