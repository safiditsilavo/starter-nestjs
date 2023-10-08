import { Body, Controller, HttpCode, Get, Post, Put, UseGuards, Param, Query, NotFoundException, Req, Res } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '@nestjs/passport';
import { Stats } from './schemas/stats.schema';
import { CreateStatsDto } from './dto/create.stats.dto';
import { UpdateStatsDto } from './dto/update.stats.dto';

@Controller('stats')
export class StatsController {
    constructor(private statsService: StatsService) {}

    @Get('/')
    async getStats(): Promise<Stats[]> {
        return this.statsService.getStats();
    }

    @Get('compare/:ids')
    async getStatCompare(@Param('ids') ids: string) {
        const stat1 = await this.statsService.getStatByIdClient(Number(ids.split('-')[0]));
        const stat2 = await this.statsService.getStatByIdClient(Number(ids.split('-')[1]));

        if (!stat1 && !stat2) {
            throw new NotFoundException(`Document with id client ${ids.split('-')[0]} or ${ids.split('-')[1]} is not found`);
        }
        
        return this.statsService.getCompareStats(stat1, stat2);
    }

    @Post('/set')
    // @UseGuards(AuthGuard())
    @HttpCode(201)
    async setStats(@Body() statsData: CreateStatsDto): Promise<Stats> {
        return this.statsService.setStat(statsData);
    }

    @Put(':id_client')
    @UseGuards(AuthGuard())
    async updateStats(@Param('id_client') idCli: number, @Body() statsData: UpdateStatsDto): Promise<Stats> {
        return this.statsService.updateById(idCli, statsData);
    }
}
