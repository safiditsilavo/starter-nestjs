import { IsOptional } from "class-validator";

export class UpdateStatsDto {
    readonly id_client: number;

    @IsOptional()
    readonly wishlist_ids: number[];

    @IsOptional()
    readonly command_ids: number[];
}