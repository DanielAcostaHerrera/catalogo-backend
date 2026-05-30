import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Anime } from './animes.schema';
import { Counter } from 'src/juegos/counter.schema';
import { CreateAnimeInput } from './dto/create-anime.input';
import { UpdateAnimeInput } from './dto/update-anime.input';
import { CatalogoAnimesResult } from './catalogo-animes.result';
import { CatalogoAnimesResultType } from './types/catalogo-animes-result.type';

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable()
export class AnimesService {
    constructor(
        @InjectModel(Anime.name)
        private readonly animeModel: Model<Anime>,

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
            { name: 'animes' },
            { $inc: { value: 1 } },
            { new: true },
        );

        if (!counter) {
            // Si no existe, inicializar en el máximo Id actual
            const maxAnime = await this.animeModel.findOne().sort({ Id: -1 }).exec();
            const startValue = maxAnime ? maxAnime.Id : 0;

            counter = await this.counterModel.create({ name: 'animes', value: startValue + 1 });
        }

        return counter.value;
    }

    // ============================================================
    //  CREAR ANIME
    // ============================================================
    async crearAnime(data: CreateAnimeInput): Promise<Anime> {
        const nextId = await this.getNextId();

        const nuevo = new this.animeModel({
            Id: nextId,
            ...data,
        });

        return nuevo.save();
    }

    // ============================================================
    //  EDITAR ANIME
    // ============================================================
    async actualizarAnime(data: UpdateAnimeInput): Promise<Anime | null> {
        return this.animeModel.findOneAndUpdate(
            { Id: data.Id },
            { $set: data },
            { new: true },
        );
    }

    // ============================================================
    //  ELIMINAR ANIME
    // ============================================================
    async eliminarAnime(Id: number): Promise<boolean> {
        const result = await this.animeModel.deleteOne({ Id });
        return result.deletedCount === 1;
    }

    // ============================================================
    //  CATÁLOGO NORMAL
    // ============================================================
    async obtenerCatalogo(page: number, limit: number): Promise<CatalogoAnimesResult> {
        const skip = (page - 1) * limit;

        const [animes, total] = await Promise.all([
            this.animeModel
                .find({}, { _id: 0 })
                .sort({ Titulo: 1 })
                .skip(skip)
                .limit(limit)
                .exec(),

            this.animeModel.countDocuments().exec(),
        ]);

        return { animes, total };
    }

    // ============================================================
    //  DETALLES DE UN ANIME
    // ============================================================
    async obtenerAnimePorId(id: number): Promise<Anime | null> {
        return this.animeModel.findOne({ Id: id }).exec();
    }

    // ============================================================
    //  ÚLTIMOS ESTRENOS
    // ============================================================
    async obtenerUltimosEstrenosAnimes(limit: number): Promise<CatalogoAnimesResultType> {
        const animes = await this.animeModel
            .find(
                {},              // 🔹 sin filtro especial, trae todos los animes
                { _id: 0 },      // 🔹 excluye el campo interno de Mongo
            )
            .sort({ Id: -1 })    // 🔹 orden descendente por Id (últimos primero)
            .limit(limit)        // 🔹 limita la cantidad
            .lean();

        const total = animes.length;

        return { animes, total };
    }

    // ============================================================
    //  CATÁLOGO FILTRADO
    // ============================================================
    async filtrarCatalogo(filtros: any): Promise<CatalogoAnimesResult> {
        const { page, limit, titulo } = filtros;

        const query: any = {};

        if (titulo) {
            const term = escapeRegex(titulo);
            query.Titulo = { $regex: term, $options: 'i' };
        }

        const animes = await this.animeModel
            .find(query, { _id: 0 })
            .sort({ Titulo: 1 })
            .exec();

        const total = animes.length;

        const start = (page - 1) * limit;
        const end = start + limit;
        const pagina = animes.slice(start, end);

        return { animes: pagina, total };
    }
}