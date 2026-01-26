import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PortadasService {
    private readonly bucketId = '60be92d03074fe9096b80b12';
    private readonly baseUrl = 'https://f005.backblazeb2.com/file/portadas/';
    private readonly apiUrl = 'https://api005.backblazeb2.com/b2api/v2/b2_get_download_authorization';

    // 👇 Aquí va el authorizationToken que empieza con 4_
    private readonly authToken =
        '4_0050e2004e068b20000000003_01c20202_0ba4fe_acct_ynMLLPX5UHkIe4l3ZiGmIjwuBKY=';

    async getSignedUrl(fileName: string): Promise<string> {
        const response = await axios.post(
            this.apiUrl,
            {
                bucketId: this.bucketId,
                fileNamePrefix: fileName,
                validDurationInSeconds: 3600,
            },
            {
                headers: {
                    Authorization: this.authToken,
                },
            },
        );

        const token = response.data.authorizationToken;
        return `${this.baseUrl}${fileName}?Authorization=${token}`;
    }
}