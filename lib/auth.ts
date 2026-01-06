import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  role: string;
};

export function getUserFromToken(authHeader: string | null): JwtPayload | null {
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch {
    return null;
  }
}
