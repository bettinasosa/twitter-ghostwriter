import path from 'path';
import os from 'os';
import {openAIClient} from "@/lib/services/openaiClient";
import Logger from "@/utils/logger";
import * as fs from "node:fs";

class FileHandler {
    constructor(private vectorStoreId: string) {}

    async uploadFiles(files: File[]): Promise<string[]> {
        try {
            return await Promise.all(
                files.map(async (file) => {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    const uploadedFile = await openAIClient.client.files.create({
                        // @ts-ignore
                        file: buffer,
                        purpose: 'assistants',
                    });

                    await openAIClient.client.beta.vectorStores.files.create(this.vectorStoreId, {
                        file_id: uploadedFile.id,
                    });

                    Logger.log(`File uploaded and added to vector store: ${uploadedFile.id}`);
                    return uploadedFile.id;
                })
            );
        } catch (error) {
            Logger.error('Failed to upload files', error);
            throw new Error('Unable to upload files');
        }
    }

    async saveToVectorStore(threadId: string, processedResponse: any): Promise<void> {
        const responseString = JSON.stringify(processedResponse);

        try {
            const tempFilePath = path.join(os.tmpdir(), `response_${threadId}_${Date.now()}.json`);
            fs.writeFileSync(tempFilePath, responseString);

            const file = await openAIClient.client.files.create({
                file: fs.createReadStream(tempFilePath),
                purpose: 'assistants',
            });

            Logger.log(`Created file with compact response: ${file.id}`);

            await openAIClient.client.beta.vectorStores.files.create(this.vectorStoreId, {
                file_id: file.id,
            });

            fs.unlinkSync(tempFilePath);
            Logger.log(`Saved compact response to vector store for thread ${threadId}`);
        } catch (error) {
            Logger.error('Error saving to vector store', error);
            throw error;
        }
    }
}

export default FileHandler;
