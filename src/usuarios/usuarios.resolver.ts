import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';
import { UsuarioType } from './types/usuario.type';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const SECRET = 'clave-super-segura';

@Resolver()
export class UsuariosResolver {
    constructor(private usuariosService: UsuariosService) {}

    // ============================================================
    //  LOGIN
    // ============================================================
    @Mutation(() => String)
    async login(
        @Args('usuario') usuario: string,
        @Args('password') password: string
    ) {
        const user = await this.usuariosService.findByUsuario(usuario);
        if (!user) throw new Error('Usuario no encontrado');

        const isValid = await bcrypt.compare(password, user.Password);
        if (!isValid) throw new Error('Contraseña incorrecta');

        return jwt.sign(
            { id: user.Id, usuario: user.Usuario, rol: user.Rol },
            SECRET,
            { expiresIn: '1h' }
        );
    }

    // ============================================================
    //  CREAR USUARIO
    // ============================================================
    @Mutation(() => String)
    async crearUsuario(@Args('data') data: CreateUsuarioInput) {
        const nuevo = await this.usuariosService.crearUsuario({
            Usuario: data.Usuario,
            Password: data.Password,
            Rol: data.Rol,
        });

        return `Usuario ${nuevo.Usuario} creado`;
    }

    // ============================================================
    //  ACTUALIZAR USUARIO
    // ============================================================
    @Mutation(() => String)
    async actualizarUsuario(@Args('data') data: UpdateUsuarioInput) {
        const actualizado = await this.usuariosService.actualizarUsuario(data.Id, {
            Usuario: data.Usuario,
            Password: data.Password,
            Rol: data.Rol,
        });

        if (!actualizado) throw new Error('Usuario no encontrado');

        return `Usuario ${actualizado.Usuario} actualizado`;
    }

    // ============================================================
    //  OBTENER USUARIO POR ID
    // ============================================================
    @Query(() => UsuarioType, { nullable: true })
    async obtenerUsuarioPorId(@Args('id', { type: () => Int }) id: number) {
        const user = await this.usuariosService.obtenerUsuarioPorId(id);
        if (!user) throw new Error('Usuario no encontrado');

        return user;
    }
}
