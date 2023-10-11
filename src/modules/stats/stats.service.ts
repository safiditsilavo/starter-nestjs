import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stats } from './schemas/stats.schema';

@Injectable()
export class StatsService {
    constructor(@InjectModel(Stats.name) private statsModel: Model<Stats>) {}

    async getStats(): Promise<Stats[]> {
        return await this.statsModel.find();
    }

    async getStatByIdClient(idCli: number): Promise<Stats> {
        return await this.statsModel.findOne({ id_client: idCli });
    }

    async getCompareStats(stat1: Stats, stat2: Stats) {
        let w1 = new Set(stat1.wishlist_ids);
        let c1 = new Set(stat1.command_ids);
        let w2 = new Set(stat2.wishlist_ids);
        let c2 = new Set(stat2.command_ids);

        const wishlistDifference = 1 - this.jaccardSimilarity(w1, w2);
        const commandDifference = 1 - this.jaccardSimilarity(c1, c2);
        const avgSimilarity = (wishlistDifference + commandDifference) / 2;
        // const max1 = (stat1.wishlist_ids.length > stat2.wishlist_ids.length) ? stat1.wishlist_ids.length : stat2.wishlist_ids.length;
        // const max2 = (stat1.command_ids.length > stat2.command_ids.length) ? stat1.command_ids.length : stat2.command_ids.length;

        return { 
            "distance-wishlist": wishlistDifference, 
            "distance-command": commandDifference,
            "average-distance": avgSimilarity,
            "entity": [
                {
                    "idCli1": stat1.id_client,
                    "w1-length": w1.size, 
                    "c1-length": c1.size 
                },
                {
                    "idCli2": stat2.id_client,
                    "w2-length": w2.size, 
                    "c2-length": c2.size 
                }
            ],
        };
    }

    async setStat(stat: Stats): Promise<Stats> {
        const { id_client, wishlist_ids, command_ids } = stat;

        let _stat = await this.statsModel.findOne({ id_client: id_client });

        if (_stat) {
            _stat = await this.statsModel.findOneAndUpdate({ id_client: id_client }, stat, {
                new: true,
                runValidators: true
            });
        } else {
            _stat = await this.statsModel.create(stat);
        }

        return _stat;
    }

    async updateById(idCli: number, stat: Stats): Promise<Stats> {
        return await this.statsModel.findOneAndUpdate({ id_client: idCli }, stat, {
            new: true,
            runValidators: true
        });
    }

    private jaccardSimilarity<T>(set1: Set<T>, set2: Set<T>): number {
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size || 0;
    }
}
