import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { Strategy } from "passport-jwt";

type JwtPayload = {
  sub: number;
  role: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtFromRequest = (request: Request): string | null => {
      const authorization = request.headers.authorization;

      if (typeof authorization !== "string") {
        return null;
      }

      const [scheme, token] = authorization.split(" ");

      if (scheme.toLowerCase() !== "bearer" || !token) {
        return null;
      }

      return token;
    };

    // `PassportStrategy(Strategy)` mixin typing resolves loosely in this setup.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? "",
    });
  }

  validate(payload: JwtPayload): { userId: number; role: string } {
    return {
      userId: payload.sub,
      role: payload.role,
    };
  }
}