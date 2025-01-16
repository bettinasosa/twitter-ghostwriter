import {openAIClient} from "@/lib/services/openaiClient";
import Logger from "@/utils/logger"

class VectorStore {
    private vectorStoreId: string | null = null;

    constructor() {}

    async getOrCreateVectorStore(): Promise<string> {
        if (this.vectorStoreId) {
            return this.vectorStoreId;
        }

        try {
            const vectorStore = await openAIClient.client.beta.vectorStores.create({
                name: 'Ghost Writter Knowledge Base',
            });

            this.vectorStoreId = vectorStore.id;
            Logger.log(`Vector store created with ID: ${this.vectorStoreId}`);

            return this.vectorStoreId;
        } catch (error) {
            Logger.error('Failed to create vector store', error);
            throw new Error('Unable to create vector store');
        }
    }

    async attachToAssistant(assistantId: string): Promise<void> {
        try {
            if (!this.vectorStoreId) {
                throw new Error('Vector store ID is not initialized');
            }

            await openAIClient.client.beta.assistants.update(assistantId, {
                tool_resources: { file_search: { vector_store_ids: [this.vectorStoreId] } },
            });

            Logger.log(`Vector store ${this.vectorStoreId} attached to assistant ${assistantId}`);
        } catch (error) {
            Logger.error('Failed to attach vector store to assistant', error);
            throw new Error('Unable to attach vector store to assistant');
        }
    }
}

export default VectorStore;
