/**
 * Search utility for transforming HTTP query parameters to TSearch objects
 * 
 * This utility provides functions to parse and validate query parameters
 * from HTTP requests and convert them into TSearch type objects that can
 * be used by services and DAOs for filtering, pagination, and sorting.
 * 
 * @author Lynx Pardelle
 * @version 1.0.0
 * @since 2025-06-19
 */

import { TSearch, TSearchQueryParams } from '@src/shared/types/search.type';

/**
 * Transform HTTP query parameters into a TSearch object
 * 
 * @param queryParams - Raw query parameters from HTTP request
 * @param allowedFilterFields - Array of field names that are allowed as filters
 * @returns TSearch object or undefined if no search parameters
 */
export function transformQueryToSearch<T>(
  queryParams: TSearchQueryParams,
  allowedFilterFields?: string[]
): TSearch<T> {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return undefined;
  }

  const search: TSearch<T> = {};

  // Parse pagination
  if (queryParams.page || queryParams.limit) {
    search.pagination = {
      page: parseInt(String(queryParams.page || 1)),
      limit: Math.min(parseInt(String(queryParams.limit || 10)), 100) // Max 100 items per page
    };
  }

  // Parse sorting
  if (queryParams.sort) {
    const sortPairs = String(queryParams.sort).split(',');
    search.sort = sortPairs.map(pair => {
      const [field, order = 'asc'] = pair.split(':');
      return {
        field: field.trim() as keyof T,
        order: (order.trim().toLowerCase() === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc'
      };
    });
  }

  // Parse text search
  if (queryParams.search) {
    search.search = {
      query: String(queryParams.search),
      fields: queryParams.searchFields 
        ? String(queryParams.searchFields).split(',').map(f => f.trim() as keyof T)
        : undefined,
      options: {
        caseSensitive: parseBoolean(queryParams.caseSensitive),
        useRegex: parseBoolean(queryParams.useRegex),
        fuzzyTolerance: queryParams.fuzzyTolerance 
          ? parseFloat(String(queryParams.fuzzyTolerance))
          : undefined
      }
    };
  }

  // Parse advanced filters
  const advanced: any = {};
  
  // Date range filters
  if (queryParams.dateFrom || queryParams.dateTo || queryParams.dateField) {
    const dateField = queryParams.dateField || 'createdAt';
    advanced.dateRange = [{
      field: dateField as keyof T,
      start: queryParams.dateFrom ? new Date(String(queryParams.dateFrom)) : undefined,
      end: queryParams.dateTo ? new Date(String(queryParams.dateTo)) : undefined
    }];
  }

  // Numeric range filters
  if (queryParams.numMin !== undefined || queryParams.numMax !== undefined || queryParams.numField) {
    const numField = queryParams.numField;
    if (numField) {
      advanced.numericRange = [{
        field: numField as keyof T,
        min: queryParams.numMin !== undefined ? Number(queryParams.numMin) : undefined,
        max: queryParams.numMax !== undefined ? Number(queryParams.numMax) : undefined
      }];
    }
  }

  // Other advanced options
  if (queryParams.includeDeleted !== undefined) {
    advanced.includeDeleted = parseBoolean(queryParams.includeDeleted);
  }

  if (queryParams.select) {
    advanced.select = String(queryParams.select).split(',').map(f => f.trim() as keyof T);
  }

  if (queryParams.populate) {
    advanced.populate = String(queryParams.populate).split(',').map(f => f.trim() as keyof T);
  }

  if (Object.keys(advanced).length > 0) {
    search.advanced = advanced;
  }

  // Parse generic filters
  const reservedParams = new Set([
    'page', 'limit', 'sort', 'search', 'searchFields', 'caseSensitive', 
    'useRegex', 'fuzzyTolerance', 'dateFrom', 'dateTo', 'dateField',
    'numMin', 'numMax', 'numField', 'includeDeleted', 'select', 'populate'
  ]);

  const filters: any = {};
  Object.keys(queryParams).forEach(key => {
    if (!reservedParams.has(key)) {
      // Only include the filter if it's in the allowed list (if provided)
      if (!allowedFilterFields || allowedFilterFields.includes(key)) {
        const value = queryParams[key];
        // Handle different value types
        if (value === 'true') filters[key] = true;
        else if (value === 'false') filters[key] = false;
        else if (value === 'null') filters[key] = null;
        else if (!isNaN(Number(value)) && value !== '') filters[key] = Number(value);
        else filters[key] = value;
      }
    }
  });

  if (Object.keys(filters).length > 0) {
    search.filters = filters;
  }

  return Object.keys(search).length > 0 ? search : undefined;
}

/**
 * Parse boolean values from query parameters
 * Handles various string representations of boolean values
 */
function parseBoolean(value: any): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  const str = String(value).toLowerCase();
  if (str === 'true' || str === '1' || str === 'yes') return true;
  if (str === 'false' || str === '0' || str === 'no') return false;
  return undefined;
}

/**
 * Get search parameter examples for documentation
 * Returns a comprehensive list of example query parameters
 */
export function getSearchExamples(): { [key: string]: string } {
  return {
    // Pagination
    'Basic pagination': '?page=1&limit=10',
    'Large page': '?page=3&limit=50',
    
    // Sorting
    'Sort by name': '?sort=name:asc',
    'Multiple sorts': '?sort=name:asc,createdAt:desc',
    'Sort by date': '?sort=updatedAt:desc',
    
    // Text search
    'Basic search': '?search=project',
    'Search with fields': '?search=website&searchFields=name,description',
    'Case sensitive search': '?search=API&caseSensitive=true',
    'Regex search': '?search=^test.*&useRegex=true',
    
    // Date filters
    'Date range': '?dateFrom=2024-01-01&dateTo=2024-12-31',
    'Date field specific': '?dateFrom=2024-01-01&dateField=startDate',
    
    // Numeric filters
    'Numeric range': '?numMin=100&numMax=500&numField=budget',
    'Minimum only': '?numMin=0&numField=priority',
    
    // Generic filters
    'Status filter': '?status=active',
    'Category filter': '?categoryId=64a7b8c9d2e3f4a5b6c7d8e9',
    'Boolean filter': '?isCompleted=true',
    
    // Advanced options
    'Select fields': '?select=id,name,status',
    'Populate relations': '?populate=category,tasks',
    'Include deleted': '?includeDeleted=true',
    
    // Combined examples
    'Complex search': '?search=api&page=1&limit=20&sort=name:asc&status=active&dateFrom=2024-01-01',
    'Full featured': '?search=project&searchFields=name,description&page=2&limit=25&sort=createdAt:desc&status=active&dateFrom=2024-01-01&dateTo=2024-12-31&select=id,name,status,createdAt'
  };
}

