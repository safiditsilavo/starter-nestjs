import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Stats, StatsSchema } from './schemas/stats.schema';

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([{ name: Stats.name, schema: StatsSchema }])
    ],
    controllers: [StatsController],
    providers: [StatsService]
})

export class StatsModule {}
