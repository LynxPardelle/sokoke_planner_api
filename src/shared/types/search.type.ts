export type TSearch<T> = {
    filters?: Partial<T>;
    pagination?: {
        page: number;
        limit: number;
    };
} | undefined;
