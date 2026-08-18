import { Resolver, Query, Int, Args, Mutation, Context } from '@nestjs/graphql';
import { SeriesService } from './series.service';
import { SeriesType } from './types/series.type';
import { CatalogoSeriesResult } from './catalogo-series.result';
import { CreateSeriesInput } from './dto/create-serie.input';
import { UpdateSeriesInput } from './dto/update-serie.input';
import { AuthContext } from '../usuarios/usuarios.context'; // 👈 importa tu interfaz

@Resolver(() => SeriesType)
export class SeriesResolver {
    constructor(private readonly service: SeriesService) {}

    // ============================================================
    //  CATÁLOGO NORMAL (SIN FILTROS)
    // ============================================================
    @Query(() => CatalogoSeriesResult)
    catalogoSeries(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
    ) {
        return this.service.obtenerCatalogo(page, limit);
    }

    // ============================================================
    //  CATÁLOGO FILTRADO (SOLO POR TÍTULO)
    // ============================================================
    @Query(() => CatalogoSeriesResult)
    catalogoSeriesFiltrado(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
        @Args('titulo', { type: () => String, nullable: true }) titulo?: string,
    ) {
        return this.service.filtrarCatalogo({ page, limit, titulo });
    }

    // ============================================================
    //  DETALLES DE UNA SERIE
    // ============================================================
    @Query(() => SeriesType, { nullable: true })
    serie(@Args('id', { type: () => Int }) id: number) {
        return this.service.obtenerSeriePorId(id);
    }

    // ============================================================
    //  ÚLTIMOS ESTRENOS
    // ============================================================
    @Query(() => CatalogoSeriesResult)
    async ultimosEstrenosSeries(
        @Args('limit', { type: () => Int }) limit: number,
    ): Promise<CatalogoSeriesResult> {
        return this.service.obtenerUltimosEstrenosSeries(limit);
    }

    // ============================================================
    //  CREAR SERIE (solo admin)
    // ============================================================
    @Mutation(() => SeriesType)
    crearSerie(@Args('data') data: CreateSeriesInput, @Context() context: AuthContext) {
        if (!context.user || context.user.rol !== 'admin') {
            throw new Error('No autorizado');
        }
        return this.service.crearSerie(data);
    }

    // ============================================================
    //  ACTUALIZAR SERIE (solo admin)
    // ============================================================
    @Mutation(() => SeriesType, { nullable: true })
    actualizarSerie(@Args('data') data: UpdateSeriesInput, @Context() context: AuthContext) {
        if (!context.user || context.user.rol !== 'admin') {
            throw new Error('No autorizado');
        }
        return this.service.actualizarSerie(data);
    }

    // ============================================================
    //  ELIMINAR SERIE (solo admin)
    // ============================================================
    @Mutation(() => Boolean)
    eliminarSerie(@Args('id', { type: () => Int }) id: number, @Context() context: AuthContext) {
        if (!context.user || context.user.rol !== 'admin') {
            throw new Error('No autorizado');
        }
        return this.service.eliminarSerie(id);
    }
}
