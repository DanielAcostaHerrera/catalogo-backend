import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'counters' })
export class Counter extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    value: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);