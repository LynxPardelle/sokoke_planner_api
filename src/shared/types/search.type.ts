/**
 * Enhanced search interface for querying entities with filtering, pagination, sorting, and text search capabilities
 * @template T - The entity type being searched
 */
export type TSearch<T> = {
    /** Partial filters based on entity properties */
    filters?: Partial<T>;
    
    /** Pagination configuration */
    pagination?: {
        /** Page number (1-based) */
        page: number;
        /** Number of items per page (max 100) */
        limit: number;
    };
    
    /** Sorting configuration */
    sort?: {
        /** Field to sort by */
        field: keyof T;
        /** Sort direction */
        order: 'asc' | 'desc';
    }[];
    
    /** Text search configuration */
    search?: {
        /** Search query string */
        query: string;
        /** Fields to search in (if not provided, searches all text fields) */
        fields?: (keyof T)[];
        /** Search options */
        options?: {
            /** Case sensitive search */
            caseSensitive?: boolean;
            /** Use regex search */
            useRegex?: boolean;
            /** Fuzzy search tolerance (0-1) */
            fuzzyTolerance?: number;
        };
    };
    
    /** Advanced filtering options */
    advanced?: {
        /** Date range filters */
        dateRange?: {
            field: keyof T;
            start?: Date;
            end?: Date;
        }[];
        
        /** Numeric range filters */
        numericRange?: {
            field: keyof T;
            min?: number;
            max?: number;
        }[];
        
        /** Include deleted/archived items */
        includeDeleted?: boolean;
        
        /** Select specific fields to return */
        select?: (keyof T)[];
        
        /** Populate referenced fields */
        populate?: (keyof T)[];
    };
} | undefined;

/**
 * Search result interface with metadata
 * @template T - The entity type being returned
 */
export type TSearchResult<T> = {
    /** Array of found items */
    items: T[];
    
    /** Search metadata */
    metadata: {
        /** Total number of items found (before pagination) */
        total: number;
        
        /** Current page number */
        page: number;
        
        /** Items per page */
        limit: number;
        
        /** Total number of pages */
        totalPages: number;
        
        /** Whether there are more pages */
        hasMore: boolean;
        
        /** Search execution time in milliseconds */
        searchTime?: number;
    };
};

/**
 * Query parameter type for search operations
 * Represents the structure of query parameters that can be sent via HTTP
 */
export type TSearchQueryParams = {
  // Pagination parameters
  page?: string | number;
  limit?: string | number;
  
  // Sorting parameters
  sort?: string; // Format: "field:order,field2:order" (e.g., "name:asc,createdAt:desc")
  
  // Text search parameters
  search?: string; // Search query string
  searchFields?: string; // Comma-separated fields to search in
  caseSensitive?: string | boolean;
  useRegex?: string | boolean;
  fuzzyTolerance?: string | number;
  
  // Date range filters
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
  dateField?: string; // Field to apply date range to
  
  // Numeric range filters
  numMin?: string | number;
  numMax?: string | number;
  numField?: string; // Field to apply numeric range to
  
  // Advanced options
  includeDeleted?: string | boolean;
  select?: string; // Comma-separated fields to select
  populate?: string; // Comma-separated fields to populate
    // Generic filters (any other query parameters will be treated as filters)
  [key: string]: any;
};