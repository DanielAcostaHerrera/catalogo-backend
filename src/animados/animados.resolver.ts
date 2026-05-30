import { Resolver, Query, Int, Args, Mutation } from '@nestjs/graphql';
import { AnimadosService } from './animados.service';
import { AnimadosType } from './types/animados.type';
import { CatalogoAnimadosResult } from './catalogo-animados.result';
import { CreateAnimadoInput } from './dto/create-animado.input';
import { UpdateAnimadoInput } from './dto/update-animado.input';

@Resolver(() => AnimadosType)
export class AnimadosResolver {
    constructor(private readonly service: AnimadosService) { }

    // ============================================================
    //  CATÁLOGO NORMAL (SIN FILTROS)
    // ============================================================
    @Query(() => CatalogoAnimadosResult)
    catalogoAnimados(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
    ) {
        return this.service.obtenerCatalogoAnimados(page, limit);
    }

    // ============================================================
    //  CATÁLOGO FILTRADO (SOLO POR TÍTULO)
    // ============================================================
    @Query(() => CatalogoAnimadosResult)
    catalogoAnimadosFiltrado(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
        @Args('titulo', { type: () => String, nullable: true }) titulo?: string,
    ) {
        return this.service.filtrarCatalogoAnimados({ page, limit, titulo });
    }

    // ============================================================
    //  DETALLES DE UN ANIMADO
    // ============================================================
    @Query(() => AnimadosType, { nullable: true })
    animado(@Args('id', { type: () => Int }) id: number) {
        return this.service.obtenerAnimadoPorId(id);
    }

    // ============================================================
    //  ÚLTIMOS ESTRENOS
    // ============================================================
    @Query(() => CatalogoAnimadosResult)
    async ultimosEstrenosAnimados(
        @Args('limit', { type: () => Int }) limit: number,
    ): Promise<CatalogoAnimadosResult> {
        return this.service.obtenerUltimosEstrenosAnimados(limit);
    }

    // ============================================================
    //  CREAR ANIMADO
    // ============================================================
    @Mutation(() => AnimadosType)
    crearAnimado(@Args('data') data: CreateAnimadoInput) {
        return this.service.crearAnimado(data);
    }

    // ============================================================
    //  ACTUALIZAR ANIMADO
    // ============================================================
    @Mutation(() => AnimadosType, { nullable: true })
    actualizarAnimado(@Args('data') data: UpdateAnimadoInput) {
        return this.service.actualizarAnimado(data);
    }

    // ============================================================
    //  ELIMINAR ANIMADO
    // ============================================================
    @Mutation(() => Boolean)
    eliminarAnimado(@Args('id', { type: () => Int }) id: number) {
        return this.service.eliminarAnimado(id);
    }
}