import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Enable CORS for frontend
  app.enableCors({
    origin: ["http://localhost:3000", "http://frontend:3000"],
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // API prefix
  app.setGlobalPrefix("api")

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle("YouApp API")
    .setDescription("YouApp Backend API Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  const port = configService.get("PORT") || 3001
  await app.listen(port)

  console.log(`🚀 YouApp Backend is running on: http://localhost:${port}`)
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`)
}

bootstrap()
