import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Juegos' })
export class Juego extends Document {
    @Prop({ required: true, unique: true })
    Id: number;

    @Prop({ required: true })
    Nombre: string;

    @Prop({ required: true })
    Tamano: number;

    @Prop({ type: Number, required: false })
    AnnoAct?: number;

    @Prop({ type: String, required: false })
    Portada?: string; // nombre del archivo en /portadas

    @Prop({ type: String, required: false })
    Sinopsis?: string;

    @Prop({ type: String, required: false })
    Requisitos?: string;
}

export const JuegoSchema = SchemaFactory.createForClass(Juego);