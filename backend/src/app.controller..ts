import { Controller, Get } from "@nestjs/common"
import type { AppService } from "./app.service"
import { ApiTags, ApiOperation } from "@nestjs/swagger"

@ApiTags("Health")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Health check endpoint" })
  getHello(): string {
    return this.appService.getHello()
  }

  @Get("health")
  @ApiOperation({ summary: "Detailed health check" })
  getHealth() {
    return this.appService.getHealth()
  }
}
