import { decode, verify } from "jsonwebtoken";
import { Environment } from "../config/environment.config";
import prisma from "../config/prisma.config";
import { Routes } from "../config/routes.config";
import { InternalError } from "../models/InternalError.model";

export enum UserRole {
  Merchant,
  Donor,
  Beneficiary,
}

export async function __util_GetActiveSession(
  cookieStore: Partial<Record<string, string>>,
  options: {
    strict?: boolean;
    role?: UserRole;
  }
) {
  const sessionId = cookieStore["session_id"];

  if (!sessionId) {
    if (options.strict) {
      throw new InternalError(
        "Access to this resource has been denied. Please sign in and try again"
      );
    }

    return null;
  }

  const payload = verify(sessionId, Environment.JwtSecret) as {
    id: string;
    role: UserRole;
  };

  const user = await prisma.user.findFirst({
    where: {
      id: payload.id,
    },
    select: {
      id: true,
      identifier: true,
      identifierType: true,
      merchant: payload.role === UserRole.Merchant,
      beneficiary: payload.role === UserRole.Beneficiary,
      donor: payload.role === UserRole.Donor,
    },
  });

  if (!user) {
    if (!options.strict) return null;
    throw new InternalError(
      "Access to this resource has been denied. Please sign in and try again"
    );
  }

  if (options.role === UserRole.Merchant && !user.merchant) {
    if (!options.strict) return null;
    throw new InternalError(
      "Access to this resource has been denied because you lack the required permission."
    );
  }

  if (options.role === UserRole.Donor && !user.donor) {
    if (!options.strict) return null;
    throw new InternalError(
      "Access to this resource has been denied because you lack the required permission."
    );
  }

  if (options.role === UserRole.Beneficiary && !user.beneficiary) {
    if (!options.strict) return null;
    throw new InternalError(
      "Access to this resource has been denied because you lack the required permission."
    );
  }
  if (user.beneficiary) {
    user.beneficiary.identityVerifiedAt = user.beneficiary.identityVerifiedAt
      ? (user.beneficiary.identityVerifiedAt.toISOString() as unknown as Date)
      : null;
  }
  if (user.merchant) {
    user.merchant.identityVerifiedAt = user.merchant.identityVerifiedAt
      ? (user.merchant.identityVerifiedAt.toISOString() as unknown as Date)
      : null;
  }
  return user;
}

export type TActiveUserSession = Awaited<
  ReturnType<typeof __util_GetActiveSession>
>;

export async function __util__clientActiveSession(
  cookieStore: Record<string, string | undefined>,
  role?: UserRole
) {
  const sessionToken = cookieStore["session_id"];

  const user = await __util_GetActiveSession(cookieStore, {
    strict: false,
    role: role,
  });

  if (sessionToken && !user) {
    const payload = decode(sessionToken) as { id: string; role: UserRole };

    if (payload.role === role) {
      return {
        redirect: {
          destination: Routes.SignIn,
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination:
          payload.role === UserRole.Merchant
            ? Routes.Merchant.Store
            : payload.role === UserRole.Donor
            ? Routes.Donor.Board
            : Routes.Beneficiary.Marketplace,
        permanent: false,
      },
    };
  }

  if (!user) {
    return {
      redirect: {
        destination: Routes.SignIn,
        permanent: false,
      },
    };
  }
  return user;
}
