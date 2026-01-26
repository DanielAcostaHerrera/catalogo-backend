import { Resolver, Query, Args } from '@nestjs/graphql';
import { PortadasService } from './portadas.service';

@Resolver()
export class PortadasResolver {
    constructor(private readonly portadasService: PortadasService) { }

    @Query(() => String)
    async portadaUrl(@Args('fileName') fileName: string): Promise<string> {
        return this.portadasService.getSignedUrl(fileName);
    }
}