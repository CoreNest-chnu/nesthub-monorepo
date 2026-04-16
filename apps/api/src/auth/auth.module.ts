import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "prisma/lib/prisma";

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [],
})
export class AuthModule {}
