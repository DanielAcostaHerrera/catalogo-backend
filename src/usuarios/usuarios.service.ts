import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './usuarios.schema';
import { Counter } from 'src/juegos/counter.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,

        @InjectModel(Counter.name)
        private readonly counterModel: Model<Counter>,
    ) {}

    // ============================================================
    //  GENERAR ID AUTOINCREMENTAL
    // ============================================================
    private async getNextId(): Promise<number> {
        let counter = await this.counterModel.findOneAndUpdate(
            { name: 'usuarios' },
            { $inc: { value: 1 } },
            { new: true },
        );

        if (!counter) {
            const maxUsuario = await this.usuarioModel.findOne().sort({ Id: -1 }).exec();
            const startValue = maxUsuario ? maxUsuario.Id : 0;

            counter = await this.counterModel.create({ name: 'usuarios', value: startValue + 1 });
        }

        return counter.value;
    }

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

        if (!data.Usuario) {
            throw new Error('Usuario no recibido en crearUsuario()');
        }

        // Verificar que no exista
        const existente = await this.findByUsuario(data.Usuario);
        if (existente) {
            throw new Error('El usuario ya existe');
        }

        const nextId = await this.getNextId();
        const hashed = await bcrypt.hash(data.Password, 10);

        const nuevo = new this.usuarioModel({
            Id: nextId,
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


