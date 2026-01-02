
import { JwtPayload, Secret, sign, verify } from 'jsonwebtoken';



const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return sign(payload, secret, {
    expiresIn: expireTime,
  });
};
verify
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
