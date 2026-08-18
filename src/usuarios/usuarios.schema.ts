import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Usuarios' })
export class Usuario extends Document {
  @Prop({ required: true, unique: true })
  Id: number;

  @Prop({ required: true, unique: true })
  Usuario: string;

  @Prop({ required: true })
  Contraseña: string;

  @Prop({ required: true })
  Rol: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
