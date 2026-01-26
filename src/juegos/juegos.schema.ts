import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Juegos' })
export class Juego extends Document {
    @Prop({ required: true, unique: true })
    Id: number;

    @Prop()
    Nombre: string;

    @Prop()
    Tamano: number;

    @Prop()
    AnnoAct: number;

    @Prop()
    Portada: string;

    @Prop()
    Sinopsis: string;

    @Prop()
    Requisitos: string;
}

export const JuegoSchema = SchemaFactory.createForClass(Juego);