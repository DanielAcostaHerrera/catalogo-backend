import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Series' })
export class Series extends Document {
    @Prop({ required: true, unique: true })
    Id: number;

    @Prop({ required: true })
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
}

export const SeriesSchema = SchemaFactory.createForClass(Series);