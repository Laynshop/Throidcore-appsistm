import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [HealthModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
