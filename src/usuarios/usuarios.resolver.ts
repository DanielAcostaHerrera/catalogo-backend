import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UsuariosService } from './usuarios.service';
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

    // Comparar contraseña con bcrypt
    const isValid = await bcrypt.compare(password, user.Password);
    if (!isValid) throw new Error('Contraseña incorrecta');

    // Generar token
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
  async crearUsuario(
    @Args('id') id: number,
    @Args('usuario') usuario: string,
    @Args('password') password: string,
    @Args('rol') rol: string,
  ) {
    const nuevo = await this.usuariosService.crearUsuario({
      Id: id,
      Usuario: usuario,
      Password: password,
      Rol: rol,
    });

    return `Usuario ${nuevo.Usuario} creado`;
  }

  // ============================================================
  //  ACTUALIZAR USUARIO
  // ============================================================
  @Mutation(() => String)
  async actualizarUsuario(
    @Args('id') id: number,
    @Args('usuario', { nullable: true }) usuario?: string,
    @Args('password', { nullable: true }) password?: string,
    @Args('rol', { nullable: true }) rol?: string,
  ) {
    const actualizado = await this.usuariosService.actualizarUsuario(id, {
      Usuario: usuario,
      Password: password,
      Rol: rol,
    });

    if (!actualizado) throw new Error('Usuario no encontrado');

    return `Usuario ${actualizado.Usuario} actualizado`;
  }

  // ============================================================
  //  OBTENER USUARIO POR ID
  // ============================================================
  @Query(() => String)
  async obtenerUsuarioPorId(@Args('id') id: number) {
    const user = await this.usuariosService.obtenerUsuarioPorId(id);
    if (!user) throw new Error('Usuario no encontrado');

    return `Usuario: ${user.Usuario}, Rol: ${user.Rol}`;
  }
}

