import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsuariosService } from './usuarios.service';
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
    @Args('contraseña') contraseña: string
  ) {
    const user = await this.usuariosService.findByUsuario(usuario);
    if (!user) throw new Error('Usuario no encontrado');
    if (user.Contraseña !== contraseña) throw new Error('Contraseña incorrecta');

    return jwt.sign(
      { id: user.Id, usuario: user.Usuario, rol: user.Rol },
      SECRET,
      { expiresIn: '1h' }
    );
  }

  // ============================================================
  //  REGISTER
  // ============================================================
  @Mutation(() => String)
  async register(
    @Args('id') id: number,
    @Args('usuario') usuario: string,
    @Args('contraseña') contraseña: string,
    @Args('rol') rol: string,
  ) {
    const nuevo = await this.usuariosService.create({
      Id: id,
      Usuario: usuario,
      Contraseña: contraseña,
      Rol: rol,
    });
    return `Usuario ${nuevo.Usuario} creado`;
  }
}

