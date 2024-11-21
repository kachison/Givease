import { ZodError } from "zod";
import { InternalError } from "../models/InternalError.model";

export async function __util__getIntlPhoneNumber(phoneNumber: string) {
  let phoneClone = phoneNumber;
  if (phoneClone.startsWith("+234"))
    phoneClone = phoneClone.replace("+234", "");
  if (phoneClone.startsWith("0")) phoneClone = parseInt(phoneClone).toString();
  if (phoneClone.length === 10) return "+234" + phoneClone;
}

export async function __util__ZodParser(schema: Promise<any>) {
  try {
    return await schema;
  } catch (error) {
    throw new InternalError(
      (error as ZodError).issues[0]?.message || (error as ZodError).message
    );
  }
}
