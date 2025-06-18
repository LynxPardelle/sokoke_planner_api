import { TSearchResult } from './search.type';

/**
 * Base DAO interface defining common CRUD operations
 * @template C - Create DTO type
 * @template S - Search parameters type  
 * @template U - Update DTO type
 * @template R - Entity return type
 */
export type TDAO<C, S, U, R> = {
  /** Create a new entity */
  create: (data: C) => Promise<R>;
  
  /** Read a single entity by ID */
  read: (id: string) => Promise<R>;
  
  /** Read all entities with search parameters, returns results with metadata */
  readAll: (search: S) => Promise<TSearchResult<R>>;
  
  /** Update an existing entity */
  update: (data: U) => Promise<R>;
  
  /** Delete an entity by ID */
  delete: (id: string) => Promise<R>;
};
