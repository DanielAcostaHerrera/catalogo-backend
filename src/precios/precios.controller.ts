import { Controller, Get } from '@nestjs/common';
import preciosConfig from '../config/precios.json'; // 👈 ruta relativa a src

@Controller('precios')
export class PreciosController {
    @Get()
    obtenerPrecios() {
        return preciosConfig;
    }
}