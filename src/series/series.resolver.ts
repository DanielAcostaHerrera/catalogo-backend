import { Resolver, Query, Int, Args, Mutation } from '@nestjs/graphql';
import { SeriesService } from './series.service';
import { SeriesType } from './types/series.type';
import { CatalogoSeriesResult } from './catalogo-series.result';
import { CreateSeriesInput } from './dto/create-serie.input';
import { UpdateSeriesInput } from './dto/update-serie.input';

@Resolver(() => SeriesType)
export class SeriesResolver {
    constructor(private readonly service: SeriesService) { }

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
    //  CREAR SERIE
    // ============================================================
    @Mutation(() => SeriesType)
    crearSerie(@Args('data') data: CreateSeriesInput) {
        return this.service.crearSerie(data);
    }

    // ============================================================
    //  ACTUALIZAR SERIE
    // ============================================================
    @Mutation(() => SeriesType, { nullable: true })
    actualizarSerie(@Args('data') data: UpdateSeriesInput) {
        return this.service.actualizarSerie(data);
    }

    // ============================================================
    //  ELIMINAR SERIE
    // ============================================================
    @Mutation(() => Boolean)
    eliminarSerie(@Args('id', { type: () => Int }) id: number) {
        return this.service.eliminarSerie(id);
    }
}