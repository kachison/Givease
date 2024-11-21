import prisma from "@/utils/config/prisma.config";
import { __util__ZodParser } from "@/utils/helpers/zod.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { compareSync } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";
import { TypeOf, z } from "zod";
import * as cookie from "cookie";
import dayjs from "dayjs";
import { UserMeta } from "@prisma/client";
import jwt from "jsonwebtoken";
import { UserRole } from "@/utils/helpers/session.helper";
import { Environment } from "@/utils/config/environment.config";

export const createSessionDtoSchema = z.object({
  identifier: z.string({
    required_error: "Missing value of account id in request body",
    invalid_type_error: "Invalid value of account id in request body",
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

export type CreateSessionDto = TypeOf<typeof createSessionDtoSchema>;

export async function getUserRecord(dto: CreateSessionDto) {
  const user = await prisma.user.findFirst({
    where: { identifier: dto.identifier },
    include: { meta: true, beneficiary: true, merchant: true, donor: true },
  });

  if (!user) {
    throw new InternalError(
      "Invalid email/password provided. Please check and try again."
    );
  }

  return user;
}

export function verifyUserPassword(params: {
  dto: CreateSessionDto;
  userMeta: UserMeta;
}) {
  const isPasswordValid = compareSync(
    params.dto.password,
    params.userMeta.password
  );

  if (!isPasswordValid) {
    throw new InternalError(
      "Invalid email/password provided. Please check and try again."
    );
  }
}

export default async function CreateSessionHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const dto = await __util__ZodParser(
      createSessionDtoSchema.parseAsync(req.body)
    );
    const user = await getUserRecord(dto);
    verifyUserPassword({
      dto,
      userMeta: user.meta!,
    });

    const sessionToken = jwt.sign(
      {
        id: user.id,
        role: user.donor
          ? UserRole.Donor
          : user.merchant
          ? UserRole.Merchant
          : UserRole.Beneficiary,
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
      message: `Welcome back!`,
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
