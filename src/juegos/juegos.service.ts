import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Juego } from './juegos.schema';
import { CatalogoResultType } from './types/catalogo-result.type';
import { Counter } from './counter.schema';
import { CrearJuegoInput } from './dto/create-juego.input';
import { ActualizarJuegoInput } from './dto/update-juego.input';

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class JuegosService {
    constructor(
        @InjectModel(Juego.name)
        private readonly juegoModel: Model<Juego>,

        @InjectModel(Counter.name)
        private readonly counterModel: Model<Counter>,
    ) { }

    private escapeRegex(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ============================================================
    //  GENERAR ID AUTOINCREMENTAL
    // ============================================================
    private async getNextId(): Promise<number> {
        const counter = await this.counterModel.findOneAndUpdate(
            { name: 'juegos' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        return counter.value;
    }

    // ============================================================
    //  CREAR JUEGO
    // ============================================================
    async crearJuego(data: CrearJuegoInput): Promise<Juego> {
        const nextId = await this.getNextId();

        const nuevo = new this.juegoModel({
            Id: nextId,
            ...data,
        });

        return nuevo.save();
    }

    // ============================================================
    //  EDITAR JUEGO
    // ============================================================
    async actualizarJuego(data: ActualizarJuegoInput): Promise<Juego | null> {
        return this.juegoModel.findOneAndUpdate(
            { Id: data.Id },
            { $set: data },
            { new: true }
        );
    }

    // ============================================================
    //  ELIMINAR JUEGO
    // ============================================================
    async eliminarJuego(Id: number): Promise<boolean> {
        const result = await this.juegoModel.deleteOne({ Id });
        return result.deletedCount === 1;
    }

    // ============================================================
    //  CATÁLOGO NORMAL
    // ============================================================
    async obtenerCatalogo(page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [juegos, total] = await Promise.all([
            this.juegoModel
                .find({}, { _id: 0 })
                .sort({ Nombre: 1 })
                .skip(skip)
                .limit(limit)
                .exec(),

            this.juegoModel.countDocuments().exec(),
        ]);

        return { juegos, total };
    }

    // ============================================================
    //  DETALLES DE UN JUEGO
    // ============================================================
    async obtenerJuegoPorId(id: number) {
        return this.juegoModel.findOne({ Id: id }).exec();
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
    //  ÚLTIMOS ESTRENOS
    // ============================================================
    async obtenerUltimosEstrenos(limit: number): Promise<CatalogoResultType> {
        const annoActual = new Date().getFullYear();

        const juegos = await this.juegoModel
            .find(
                {
                    AnnoAct: annoActual,
                    Nombre: { $not: /\[online\]/i },
                },
                { _id: 0 },
            )
            .sort({ Id: -1 })
            .limit(limit)
            .lean();

        const total = juegos.length;

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

        const query: any = {};

        // 🔹 CORREGIDO: escapamos caracteres especiales antes de usar regex
        if (nombre) {
            const term = escapeRegex(nombre);
            query.Nombre = { $regex: term, $options: 'i' };
        }

        if (tamanoMin !== undefined || tamanoMax !== undefined) {
            const minMB = tamanoMin !== undefined ? tamanoMin * 1024 : undefined;
            const maxMB = tamanoMax !== undefined ? tamanoMax * 1024 : undefined;

            query.Tamano = {};
            if (minMB !== undefined) query.Tamano.$gte = minMB;
            if (maxMB !== undefined) query.Tamano.$lte = maxMB;
        }

        if (annoMin !== undefined || annoMax !== undefined) {
            query.AnnoAct = {};
            if (annoMin !== undefined) query.AnnoAct.$gte = annoMin;
            if (annoMax !== undefined) query.AnnoAct.$lte = annoMax;
        }

        let juegos = await this.juegoModel
            .find(query, { _id: 0 })
            .sort({ Nombre: 1 })
            .exec();

        if (precioMin !== undefined || precioMax !== undefined) {
            juegos = juegos.filter(j => {
                const precio = this.calcularPrecio(j);
                if (precioMin !== undefined && precio < precioMin) return false;
                if (precioMax !== undefined && precio > precioMax) return false;
                return true;
            });
        }

        const total = juegos.length;

        const start = (page - 1) * limit;
        const end = start + limit;
        const pagina = juegos.slice(start, end);

        return {
            juegos: pagina,
            total,
        };
    }
}
