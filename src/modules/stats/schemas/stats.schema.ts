import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type StatsDocument = HydratedDocument<Stats>;

@Schema()
export class Stats {
    @Prop({ required: true })
    id_client: number;

    @Prop()
    wishlist_ids: number[];

    @Prop()
    command_ids: number[];
}

export const StatsSchema = SchemaFactory.createForClass(Stats);