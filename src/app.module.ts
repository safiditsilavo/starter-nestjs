import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { StatsModule } from './modules/stats/stats.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
      ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
      MongooseModule.forRoot(process.env.DB_URI),
      StatsModule,
      AuthModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
