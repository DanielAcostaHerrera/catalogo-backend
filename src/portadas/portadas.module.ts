import { Module } from '@nestjs/common';
import { PortadasResolver } from './portadas.resolver';
import { PortadasService } from './portadas.service';

@Module({
    providers: [PortadasResolver, PortadasService],
})
export class PortadasModule { }