import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Series } from './series.schema';
import { Counter } from 'src/juegos/counter.schema';
import { CreateSeriesInput } from './dto/create-serie.input';
import { UpdateSeriesInput } from './dto/update-serie.input';
import { CatalogoSeriesResult } from './catalogo-series.result';
import { CatalogoSeriesResultType } from './types/catalogo-series-result.type';


function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class SeriesService {
    constructor(
        @InjectModel(Series.name)
        private readonly seriesModel: Model<Series>,

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
            { name: 'series' },
            { $inc: { value: 1 } },
            { new: true },
        );

        if (!counter) {
            // Si no existe, inicializar en el máximo Id actual
            const maxSerie = await this.seriesModel.findOne().sort({ Id: -1 }).exec();
            const startValue = maxSerie ? maxSerie.Id : 0;

            counter = await this.counterModel.create({ name: 'series', value: startValue + 1 });
        }

        return counter.value;
    }

    // ============================================================
    //  CREAR SERIE
    // ============================================================
    async crearSerie(data: CreateSeriesInput): Promise<Series> {
        const nextId = await this.getNextId();

        const nueva = new this.seriesModel({
            Id: nextId,
            ...data,
        });

        return nueva.save();
    }

    // ============================================================
    //  EDITAR SERIE
    // ============================================================
    async actualizarSerie(data: UpdateSeriesInput): Promise<Series | null> {
        return this.seriesModel.findOneAndUpdate(
            { Id: data.Id },
            { $set: data },
            { new: true },
        );
    }

    // ============================================================
    //  ELIMINAR SERIE
    // ============================================================
    async eliminarSerie(Id: number): Promise<boolean> {
        const result = await this.seriesModel.deleteOne({ Id });
        return result.deletedCount === 1;
    }

    // ============================================================
    //  CATÁLOGO NORMAL
    // ============================================================
    async obtenerCatalogo(page: number, limit: number): Promise<CatalogoSeriesResult> {
        const skip = (page - 1) * limit;

        const [series, total] = await Promise.all([
            this.seriesModel
                .find({}, { _id: 0 })
                .sort({ Titulo: 1 })
                .skip(skip)
                .limit(limit)
                .exec(),

            this.seriesModel.countDocuments().exec(),
        ]);

        return { series, total };
    }

    // ============================================================
    //  DETALLES DE UNA SERIE
    // ============================================================
    async obtenerSeriePorId(id: number): Promise<Series | null> {
        return this.seriesModel.findOne({ Id: id }).exec();
    }

    // ============================================================
    //  ÚLTIMOS ESTRENOS
    // ============================================================

    async obtenerUltimosEstrenosSeries(limit: number): Promise<CatalogoSeriesResultType> {
        const series = await this.seriesModel
            .find(
                {},              // 🔹 sin filtro especial, trae todas las series
                { _id: 0 },      // 🔹 excluye el campo interno de Mongo
            )
            .sort({ Id: -1 })    // 🔹 orden descendente por Id (últimas primero)
            .limit(limit)        // 🔹 limita la cantidad
            .lean();

        const total = series.length;

        return { series, total };
    }

    // ============================================================
    //  CATÁLOGO FILTRADO
    // ============================================================
    async filtrarCatalogo(filtros: any): Promise<CatalogoSeriesResult> {
        const { page, limit, titulo } = filtros;

        const query: any = {};

        if (titulo) {
            const term = escapeRegex(titulo);
            query.Titulo = { $regex: term, $options: 'i' };
        }

        const series = await this.seriesModel
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