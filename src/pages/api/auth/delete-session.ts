import { __util_GetActiveSession } from "@/utils/helpers/session.helper";
import { InternalError } from "@/utils/models/InternalError.model";
import { NextApiRequest, NextApiResponse } from "next";
import * as cookie from "cookie";

export default async function GetSessionHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = await __util_GetActiveSession(req.cookies, {
      strict: true,
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("session_id", "", {
        httpOnly: true,
        path: "/",
        priority: "high",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
    );

    res.status(200).json({
      message: "You have been logged out.",
      data: user,
    });
  } catch (error) {
    const err = new InternalError(
      error,
      "An error occurred while validating your session, please try again."
    );
    res.status(400).json({ message: err.message });
  }
}
