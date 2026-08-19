import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './usuarios.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {}

  // ============================================================
  //  OBTENER USUARIO POR ID
  // ============================================================
  async obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ Id: id }).exec();
  }

  // ============================================================
  //  OBTENER USUARIO POR NOMBRE
  // ============================================================
  async findByUsuario(usuario: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ Usuario: usuario }).exec();
  }

  // ============================================================
  //  CREAR USUARIO
  // ============================================================
  async crearUsuario(data: Partial<Usuario>): Promise<Usuario> {
    if (!data.Password) {
      throw new Error('Password no recibido en crearUsuario()');
    }

    const hashed = await bcrypt.hash(data.Password, 10);

    const nuevo = new this.usuarioModel({
      Id: data.Id,
      Usuario: data.Usuario,
      Password: hashed,
      Rol: data.Rol,
    });

    return nuevo.save();
  }

  // ============================================================
  //  ACTUALIZAR USUARIO
  // ============================================================
  async actualizarUsuario(id: number, data: Partial<Usuario>): Promise<Usuario | null> {
    const updateData: any = {};

    if (data.Usuario !== undefined) updateData.Usuario = data.Usuario;
    if (data.Rol !== undefined) updateData.Rol = data.Rol;

    if (data.Password) {
      updateData.Password = await bcrypt.hash(data.Password, 10);
    }

    return this.usuarioModel
      .findOneAndUpdate({ Id: id }, updateData, { new: true })
      .exec();
  }
}



