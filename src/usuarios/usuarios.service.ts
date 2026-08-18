import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './usuarios.schema';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}

  async findByUsuario(usuario: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ Usuario: usuario }).exec();
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const nuevo = new this.usuarioModel(data);
    return nuevo.save();
  }
}
