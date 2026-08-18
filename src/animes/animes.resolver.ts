import { Resolver, Query, Int, Args, Mutation, Context } from '@nestjs/graphql';
import { AnimesService } from './animes.service';
import { AnimeType } from './types/animes.type';
import { CatalogoAnimesResult } from './catalogo-animes.result';
import { CreateAnimeInput } from './dto/create-anime.input';
import { UpdateAnimeInput } from './dto/update-anime.input';
import { AuthContext } from '../usuarios/usuarios.context';

@Resolver(() => AnimeType)
export class AnimesResolver {
    constructor(private readonly service: AnimesService) {}

    // ============================================================
    //  CATÁLOGO NORMAL (SIN FILTROS)
    // ============================================================
    @Query(() => CatalogoAnimesResult)
    catalogoAnimes(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
    ) {
        return this.service.obtenerCatalogo(page, limit);
    }

    // ============================================================
    //  CATÁLOGO FILTRADO (SOLO POR TÍTULO)
    // ============================================================
    @Query(() => CatalogoAnimesResult)
    catalogoAnimesFiltrado(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
        @Args('titulo', { type: () => String, nullable: true }) titulo?: string,
    ) {
        return this.service.filtrarCatalogo({ page, limit, titulo });
    }

    // ============================================================
    //  DETALLES DE UN ANIME
    // ============================================================
    @Query(() => AnimeType, { nullable: true })
    anime(@Args('id', { type: () => Int }) id: number) {
        return this.service.obtenerAnimePorId(id);
    }

    // ============================================================
    //  ÚLTIMOS ESTRENOS
    // ============================================================
    @Query(() => CatalogoAnimesResult)
    async ultimosEstrenosAnimes(
        @Args('limit', { type: () => Int }) limit: number,
    ): Promise<CatalogoAnimesResult> {
        return this.service.obtenerUltimosEstrenosAnimes(limit);
    }

    // ============================================================
    //  CREAR ANIME (solo admin)
    // ============================================================
    @Mutation(() => AnimeType)
    crearAnime(@Args('data') data: CreateAnimeInput, @Context() context: AuthContext) {
        if (!context.user || context.user.rol !== 'admin') {
            throw new Error('No autorizado');
        }
        return this.service.crearAnime(data);
    }

    // ============================================================
    //  ACTUALIZAR ANIME (solo admin)
    // ============================================================
    @Mutation(() => AnimeType, { nullable: true })
    actualizarAnime(@Args('data') data: UpdateAnimeInput, @Context() context: AuthContext) {
        if (!context.user || context.user.rol !== 'admin') {
            throw new Error('No autorizado');
        }
        return this.service.actualizarAnime(data);
    }

    // ============================================================
    //  ELIMINAR ANIME (solo admin)
    // ============================================================
    @Mutation(() => Boolean)
    eliminarAnime(@Args('id', { type: () => Int }) id: number, @Context() context: AuthContext) {
        if (!context.user || context.user.rol !== 'admin') {
            throw new Error('No autorizado');
        }
        return this.service.eliminarAnime(id);
    }
}
