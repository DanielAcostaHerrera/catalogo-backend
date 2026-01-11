import { Resolver, Query, Int, Args, ResolveField, Parent } from '@nestjs/graphql';
import { JuegosService } from './juegos.service';
import { Juego } from './juegos.entity';
import { CatalogoResult } from './catalogo.result';

@Resolver(() => Juego)
export class JuegosResolver {
    constructor(private readonly service: JuegosService) { }

    // ============================================================
    //  CATÁLOGO NORMAL (SIN FILTROS)
    // ============================================================
    @Query(() => CatalogoResult)
    catalogo(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
    ) {
        return this.service.obtenerCatalogo(page, limit);
    }

    // ============================================================
    //  CATÁLOGO FILTRADO (BÚSQUEDA + FILTROS)
    // ============================================================
    @Query(() => CatalogoResult)
    catalogoFiltrado(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
        @Args('nombre', { type: () => String, nullable: true }) nombre?: string,
        @Args('tamanoMin', { type: () => Number, nullable: true }) tamanoMin?: number,
        @Args('tamanoMax', { type: () => Number, nullable: true }) tamanoMax?: number,
        @Args('annoMin', { type: () => Int, nullable: true }) annoMin?: number,
        @Args('annoMax', { type: () => Int, nullable: true }) annoMax?: number,
        @Args('precioMin', { type: () => Int, nullable: true }) precioMin?: number,
        @Args('precioMax', { type: () => Int, nullable: true }) precioMax?: number,
    ) {
        return this.service.filtrarCatalogo({
            page,
            limit,
            nombre,
            tamanoMin,
            tamanoMax,
            annoMin,
            annoMax,
            precioMin,
            precioMax,
        });
    }

    // ============================================================
    //  DETALLES DE UN JUEGO
    // ============================================================
    @Query(() => Juego, { nullable: true })
    juego(@Args('id', { type: () => Int }) id: number) {
        return this.service.obtenerJuegoPorId(id);
    }

    // ============================================================
    //  PRECIO (USANDO EL SERVICIO)
    // ============================================================
    @ResolveField(() => Int)
    Precio(@Parent() juego: Juego) {
        return this.service.calcularPrecio(juego);
    }

    // ============================================================
    //  TAMAÑO FORMATEADO (MB / GB)
    // ============================================================
    @ResolveField(() => String)
    TamanoFormateado(@Parent() juego: Juego) {
        const nombre = juego.Nombre?.toLowerCase() || "";
        const mb = Number(juego.Tamano);

        // Caso especial: juegos online o tamaño 0
        if (mb === 0 || nombre.includes("[online]")) {
            return "Variable";
        }

        // Si no hay dato válido
        if (!mb || isNaN(mb)) {
            return "Desconocido";
        }

        // Conversión MB → GB
        if (mb < 1024) {
            return `${mb} MB`;
        }

        const gb = mb / 1024;
        return `${gb.toFixed(2)} GB`;
    }
}
