import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual, Not } from 'typeorm';
import { Juego } from './juegos.entity';

@Injectable()
export class JuegosService {
    constructor(
        @InjectRepository(Juego)
        private readonly repo: Repository<Juego>,
    ) { }

    // ============================================================
    //  CATÁLOGO NORMAL
    // ============================================================
    async obtenerCatalogo(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [juegos, total] = await this.repo.findAndCount({
            select: ['Id', 'Nombre', 'Portada', 'Tamano', 'AnnoAct', 'Requisitos'], // 🔹 añadimos Requisitos
            skip,
            take: limit,
            order: { Nombre: 'ASC' },
        });

        return {
            juegos,
            total,
        };
    }


    // ============================================================
    //  DETALLES DE UN JUEGO
    // ============================================================
    async obtenerJuegoPorId(id: number) {
        return this.repo.findOne({ where: { Id: id } });
    }

    // ============================================================
    //  FUNCIÓN PARA CALCULAR PRECIO
    // ============================================================
    calcularPrecio(juego: Juego): number {
        const nombre = juego.Nombre.toLowerCase();
        const mb = juego.Tamano;
        const gb = mb / 1024;

        if (nombre.includes('[online]')) return 1000;
        if (gb < 1) return 100;
        if (gb < 10) return 200;
        if (gb < 30) return 400;
        if (gb < 60) return 600;
        if (gb < 80) return 800;

        return 1000;
    }

    // ============================================================
    //  ULTIMOS ESTRENOS
    // ============================================================

    async obtenerUltimosEstrenos(limit: number) {
        const annoActual = new Date().getFullYear();

        const [juegos, total] = await this.repo.findAndCount({
            select: ['Id', 'Nombre', 'Portada', 'AnnoAct'],
            where: {
                AnnoAct: annoActual,
                Nombre: Not(Like('%[online]%')), // 🔹 excluye online
            },
            order: { Id: 'DESC' },
            take: limit,
        });

        return { juegos, total };
    }

    // ============================================================
    //  CATÁLOGO FILTRADO
    // ============================================================
    async filtrarCatalogo(filtros: any) {
        const {
            page,
            limit,
            nombre,
            tamanoMin,
            tamanoMax,
            annoMin,
            annoMax,
            precioMin,
            precioMax,
        } = filtros;

        const where: any = {};

        if (nombre) {
            where.Nombre = Like(`%${nombre}%`);
        }

        if (tamanoMin !== undefined || tamanoMax !== undefined) {
            const minMB = tamanoMin !== undefined ? tamanoMin * 1024 : undefined;
            const maxMB = tamanoMax !== undefined ? tamanoMax * 1024 : undefined;

            if (minMB !== undefined && maxMB !== undefined) {
                where.Tamano = Between(minMB, maxMB);
            } else if (minMB !== undefined) {
                where.Tamano = MoreThanOrEqual(minMB);
            } else if (maxMB !== undefined) {
                where.Tamano = LessThanOrEqual(maxMB);
            }
        }

        if (annoMin !== undefined || annoMax !== undefined) {
            if (annoMin !== undefined && annoMax !== undefined) {
                where.AnnoAct = Between(annoMin, annoMax);
            } else if (annoMin !== undefined) {
                where.AnnoAct = MoreThanOrEqual(annoMin);
            } else if (annoMax !== undefined) {
                where.AnnoAct = LessThanOrEqual(annoMax);
            }
        }

        // 1. Traer todos los juegos que cumplen filtros SQL
        let juegos = await this.repo.find({
            where,
            order: { Nombre: 'ASC' },
        });

        // 2. Filtrar por precio en memoria
        if (precioMin !== undefined || precioMax !== undefined) {
            juegos = juegos.filter(j => {
                const precio = this.calcularPrecio(j);
                if (precioMin !== undefined && precio < precioMin) return false;
                if (precioMax !== undefined && precio > precioMax) return false;
                return true;
            });
        }

        // 3. Calcular total
        const total = juegos.length;

        // 4. Paginar después de filtrar
        const start = (page - 1) * limit;
        const end = start + limit;
        const pagina = juegos.slice(start, end);

        // 5. Devolver juegos + total
        return {
            juegos: pagina,
            total, // 🔹 ahora el frontend sabe cuántos hay en total
        };
    }
}
