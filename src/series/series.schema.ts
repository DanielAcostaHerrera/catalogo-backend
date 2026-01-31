import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SeriesDocument = Series & Document;

@Schema()
export class Series {
    @Prop({ required: true, unique: true })
    Titulo: string;

    @Prop({ required: true })
    Temporadas: number;

    @Prop({ required: true })
    Episodios: string;

    @Prop({ required: true })
    Sinopsis: string;

    @Prop({ required: true })
    Portada: string;

    @Prop({ required: true })
    Anno: number;

    @Prop({ required: true, unique: true })
    Id: number;
}

export const SeriesSchema = SchemaFactory.createForClass(Series);