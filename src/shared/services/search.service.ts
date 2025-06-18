import { Model, Document } from 'mongoose';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';

/**
 * Search service utility for MongoDB operations
 * Provides common search functionality across all DAOs
 */
export class SearchService {
    /**
     * Build MongoDB query from TSearch parameters
     * @param searchParams - Search parameters
     * @returns MongoDB query object and options
     */
    static buildMongoQuery<T>(searchParams?: TSearch<T>) {
        const query: any = {};
        const options: any = {};
        const sort: any = {};

        if (!searchParams) {
            return { query, options, sort };
        }

        // Apply filters
        if (searchParams.filters) {
            Object.assign(query, searchParams.filters);
        }

        // Apply text search
        if (searchParams.search?.query) {
            const searchQuery = searchParams.search.query;
            const searchFields = searchParams.search.fields || [];
            const searchOptions = searchParams.search.options || {};

            if (searchFields.length > 0) {
                // Search in specific fields
                const orConditions = searchFields.map(field => {
                    const searchPattern = searchOptions.useRegex 
                        ? searchQuery 
                        : searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex
                    
                    const regexOptions = searchOptions.caseSensitive ? 'g' : 'gi';
                    return { [field]: { $regex: searchPattern, $options: regexOptions } };
                });
                
                if (query.$or) {
                    query.$and = [{ $or: query.$or }, { $or: orConditions }];
                    delete query.$or;
                } else {
                    query.$or = orConditions;
                }
            } else {
                // Use MongoDB text search if available
                query.$text = { 
                    $search: searchQuery,
                    $caseSensitive: searchOptions.caseSensitive || false
                };
            }
        }

        // Apply date range filters
        if (searchParams.advanced?.dateRange) {
            searchParams.advanced.dateRange.forEach(range => {
                const dateQuery: any = {};
                if (range.start) dateQuery.$gte = range.start;
                if (range.end) dateQuery.$lte = range.end;
                if (Object.keys(dateQuery).length > 0) {
                    query[range.field as string] = dateQuery;
                }
            });
        }

        // Apply numeric range filters
        if (searchParams.advanced?.numericRange) {
            searchParams.advanced.numericRange.forEach(range => {
                const numQuery: any = {};
                if (range.min !== undefined) numQuery.$gte = range.min;
                if (range.max !== undefined) numQuery.$lte = range.max;
                if (Object.keys(numQuery).length > 0) {
                    query[range.field as string] = numQuery;
                }
            });
        }

        // Apply sorting
        if (searchParams.sort && searchParams.sort.length > 0) {
            searchParams.sort.forEach(sortItem => {
                sort[sortItem.field as string] = sortItem.order === 'desc' ? -1 : 1;
            });
        } else {
            // Default sort by updatedAt descending
            sort.updatedAt = -1;
        }

        // Apply pagination
        if (searchParams.pagination) {
            options.skip = (searchParams.pagination.page - 1) * searchParams.pagination.limit;
            options.limit = Math.min(searchParams.pagination.limit, 100); // Max 100 items per page
        }

        // Apply field selection
        if (searchParams.advanced?.select) {
            options.select = searchParams.advanced.select.join(' ');
        }

        // Apply population
        if (searchParams.advanced?.populate) {
            options.populate = searchParams.advanced.populate.map(field => ({ path: field as string }));
        }

        return { query, options, sort };
    }

    /**
     * Execute search query and return formatted results
     * @param model - Mongoose model
     * @param searchParams - Search parameters
     * @param transformer - Function to transform documents to entity type
     * @returns Search results with metadata
     */
    static async executeSearch<T, D extends Document>(
        model: Model<D>,
        searchParams: TSearch<T> | undefined,
        transformer: (doc: D) => T
    ): Promise<TSearchResult<T>> {
        const startTime = Date.now();
        const { query, options, sort } = this.buildMongoQuery(searchParams);

        // Get total count for pagination metadata
        const totalCount = await model.countDocuments(query);

        // Execute the search query
        let queryBuilder = model.find(query, options.select, {
            skip: options.skip,
            limit: options.limit,
            sort
        });

        // Apply population if specified
        if (options.populate) {
            options.populate.forEach((pop: any) => {
                queryBuilder = queryBuilder.populate(pop);
            });
        }

        const documents = await queryBuilder.exec();
        const searchTime = Date.now() - startTime;

        // Transform documents to entity type
        const items = documents.map(transformer);

        // Calculate pagination metadata
        const page = searchParams?.pagination?.page || 1;
        const limit = searchParams?.pagination?.limit || totalCount;
        const totalPages = Math.ceil(totalCount / limit);
        const hasMore = page < totalPages;

        return {
            items,
            metadata: {
                total: totalCount,
                page,
                limit,
                totalPages,
                hasMore,
                searchTime
            }
        };
    }

    /**
     * Build aggregation pipeline for complex searches
     * @param searchParams - Search parameters
     * @returns MongoDB aggregation pipeline
     */
    static buildAggregationPipeline<T>(searchParams?: TSearch<T>): any[] {
        const pipeline: any[] = [];

        if (!searchParams) {
            return pipeline;
        }

        // Match stage for filters
        const matchQuery: any = {};
        
        if (searchParams.filters) {
            Object.assign(matchQuery, searchParams.filters);
        }

        if (Object.keys(matchQuery).length > 0) {
            pipeline.push({ $match: matchQuery });
        }

        // Add text search stage if needed
        if (searchParams.search?.query) {
            pipeline.push({
                $match: {
                    $text: { 
                        $search: searchParams.search.query,
                        $caseSensitive: searchParams.search.options?.caseSensitive || false
                    }
                }
            });
        }

        // Add sorting stage
        if (searchParams.sort && searchParams.sort.length > 0) {
            const sortStage: any = {};
            searchParams.sort.forEach(sortItem => {
                sortStage[sortItem.field as string] = sortItem.order === 'desc' ? -1 : 1;
            });
            pipeline.push({ $sort: sortStage });
        }

        // Add pagination stages
        if (searchParams.pagination) {
            const skip = (searchParams.pagination.page - 1) * searchParams.pagination.limit;
            const limit = Math.min(searchParams.pagination.limit, 100);
            
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });
        }

        // Add field selection stage
        if (searchParams.advanced?.select) {
            const projectStage: any = {};
            searchParams.advanced.select.forEach(field => {
                projectStage[field as string] = 1;
            });
            pipeline.push({ $project: projectStage });
        }

        return pipeline;
    }
}
