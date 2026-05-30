import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Animados } from './animados.schema';
import { Counter } from 'src/juegos/counter.schema';
import { CreateAnimadoInput } from './dto/create-animado.input';
import { UpdateAnimadoInput } from './dto/update-animado.input';
import { CatalogoAnimadosResult } from './catalogo-animados.result';
import { CatalogoAnimadosResultType } from './types/catalogo-animados-result.type';

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class AnimadosService {
    constructor(
        @InjectModel(Animados.name)
        private readonly animadosModel: Model<Animados>,

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
        let counter = await this.counterModel.findOneAndUpdate(
            { name: 'animados' },
            { $inc: { value: 1 } },
            { new: true },
        );

        if (!counter) {
            const maxAnimado = await this.animadosModel.findOne().sort({ Id: -1 }).exec();
            const startValue = maxAnimado ? maxAnimado.Id : 0;

            counter = await this.counterModel.create({ name: 'animados', value: startValue + 1 });
        }

        return counter.value;
    }

    // ============================================================
    //  CREAR ANIMADO
    // ============================================================
    async crearAnimado(data: CreateAnimadoInput): Promise<Animados> {
        const nextId = await this.getNextId();

        const nuevo = new this.animadosModel({
            Id: nextId,
            ...data,
        });

        return nuevo.save();
    }

    // ============================================================
    //  EDITAR ANIMADO
    // ============================================================
    async actualizarAnimado(data: UpdateAnimadoInput): Promise<Animados | null> {
        return this.animadosModel.findOneAndUpdate(
            { Id: data.Id },
            { $set: data },
            { new: true },
        );
    }

    // ============================================================
    //  ELIMINAR ANIMADO
    // ============================================================
    async eliminarAnimado(Id: number): Promise<boolean> {
        const result = await this.animadosModel.deleteOne({ Id });
        return result.deletedCount === 1;
    }

    // ============================================================
    //  CATÁLOGO NORMAL
    // ============================================================
    async obtenerCatalogoAnimados(page: number, limit: number): Promise<CatalogoAnimadosResult> {
        const skip = (page - 1) * limit;

        const [series, total] = await Promise.all([
            this.animadosModel
                .find({}, { _id: 0 })
                .sort({ Titulo: 1 })
                .skip(skip)
                .limit(limit)
                .exec(),

            this.animadosModel.countDocuments().exec(),
        ]);

        return { series, total };
    }

    // ============================================================
    //  DETALLES DE UN ANIMADO
    // ============================================================
    async obtenerAnimadoPorId(id: number): Promise<Animados | null> {
        return this.animadosModel.findOne({ Id: id }).exec();
    }

    // ============================================================
    //  ÚLTIMOS ESTRENOS
    // ============================================================
    async obtenerUltimosEstrenosAnimados(limit: number): Promise<CatalogoAnimadosResultType> {
        const series = await this.animadosModel
            .find(
                {},
                { _id: 0 },
            )
            .sort({ Id: -1 })
            .limit(limit)
            .lean();

        const total = series.length;

        return { series, total };
    }

    // ============================================================
    //  CATÁLOGO FILTRADO
    // ============================================================
    async filtrarCatalogoAnimados(filtros: any): Promise<CatalogoAnimadosResult> {
        const { page, limit, titulo } = filtros;

        const query: any = {};

        if (titulo) {
            const term = escapeRegex(titulo);
            query.Titulo = { $regex: term, $options: 'i' };
        }

        const series = await this.animadosModel
            .find(query, { _id: 0 })
            .sort({ Titulo: 1 })
            .exec();

        const total = series.length;

        const start = (page - 1) * limit;
        const end = start + limit;
        const pagina = series.slice(start, end);

        return { series: pagina, total };
    }
}