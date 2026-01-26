import { Resolver, Query, Int, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { JuegosService } from './juegos.service';
import { JuegoType } from './juego.type';
import { CatalogoResult } from './catalogo.result';
import { CrearJuegoInput } from './dto/create-juego.input';
import { ActualizarJuegoInput } from './dto/update-juego.input';

@Resolver(() => JuegoType)
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
    @Query(() => JuegoType, { nullable: true })
    juego(@Args('id', { type: () => Int }) id: number) {
        return this.service.obtenerJuegoPorId(id);
    }

    // ============================================================
    //  CREAR JUEGO
    // ============================================================
    @Mutation(() => JuegoType)
    crearJuego(@Args('data') data: CrearJuegoInput) {
        return this.service.crearJuego(data);
    }

    // ============================================================
    //  ACTUALIZAR JUEGO
    // ============================================================
    @Mutation(() => JuegoType, { nullable: true })
    actualizarJuego(@Args('data') data: ActualizarJuegoInput) {
        return this.service.actualizarJuego(data);
    }

    // ============================================================
    //  ELIMINAR JUEGO
    // ============================================================
    @Mutation(() => Boolean)
    eliminarJuego(@Args('id', { type: () => Int }) id: number) {
        return this.service.eliminarJuego(id);
    }

    // ============================================================
    //  PRECIO (USANDO EL SERVICIO)
    // ============================================================
    @ResolveField(() => Int)
    Precio(@Parent() juego: any) {
        return this.service.calcularPrecio(juego);
    }

    // ============================================================
    //  ULTIMOS ESTRENOS
    // ============================================================
    @Query(() => CatalogoResult)
    async ultimosEstrenos(
        @Args('limit', { type: () => Int }) limit: number,
    ): Promise<CatalogoResult> {
        return this.service.obtenerUltimosEstrenos(limit);
    }

    // ============================================================
    //  TAMAÑO FORMATEADO (MB / GB)
    // ============================================================
    @ResolveField(() => String)
    TamanoFormateado(@Parent() juego: any) {
        const nombre = juego.Nombre?.toLowerCase() || "";
        const mb = Number(juego.Tamano);

        if (mb === 0 || nombre.includes("[online]")) {
            return "Variable";
        }

        if (!mb || isNaN(mb)) {
            return "Desconocido";
        }

        if (mb < 1024) {
            return `${mb} MB`;
        }

        const gb = mb / 1024;
        return `${gb.toFixed(2)} GB`;
    }
}