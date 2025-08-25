import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { CacheModule } from "@nestjs/cache-manager"
import { redisStore } from "cache-manager-redis-store"

import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { ProfilesModule } from "./profiles/profiles.module"
import { ChatModule } from "./chat/chat.module"
import { NotificationsModule } from "./notifications/notifications.module"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),

    // Redis Cache
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as any,
        url: configService.get<string>("REDIS_URL"),
        ttl: 300, // 5 minutes default TTL
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    AuthModule,
    UsersModule,
    ProfilesModule,
    ChatModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
