import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './api/supabase.service';


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}
@Injectable({
  providedIn: 'root',
})
export class CrudService {
  supabase = inject(SupabaseService).getClient();   

  //crud
  /**
   * Create a new record in the specified table
   */
  async create<T>(table: string, data: Partial<T>): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: result as T,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to create record',
          code: error.code,
          details: error,
        },
      };
    }
  }

  /**
   * Get a single record by ID
   */
  async getById<T>(
    table: string,
    value: string | number,
    property: string,
    options?: {
      properties?: string[];
    }
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select(options?.properties?.join(',') ?? '*')
        .eq(property, value)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Record not found');

      return {
        success: true,
        data: data as T,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch record',
          code: error.code,
          details: error,
        },
      };
    }
  }

  /**
   * Get multiple records with optional filters
   */
  async getMany<T>(
    table: string,
    options?: {
      filters?: { column: string; value: any }[];
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
      properties?: string[];
    }
  ): Promise<ApiResponse<T[]>> {
    try {
      let query = this.supabase
        .from(table)
        .select(options?.properties?.join(',') ?? '*');

      // Apply filters if provided
      if (options?.filters) {
        for (const filter of options.filters) {
          query = query.eq(filter.column, filter.value);
        }
      }

      // Apply ordering if provided
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      // Apply pagination if provided
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 1000) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data: data as T[],
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to fetch records',
          code: error.code,
          details: error,
        },
      };
    }
  }

  /**
   * Update a record by ID
   */
  async update<T>(
    table: string,
    property: string,
    id: string | number,
    data: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update(data)
        .eq(property, id)
        .select()
        .single();

      if (error) throw error;
      if (!result) throw new Error('Record not found');

      return {
        success: true,
        data: result as T,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to update record',
          code: error.code,
          details: error,
        },
      };
    }
  }

  // Upsert a record

  async upsert<T>(
    table: string,
    data: Partial<T>,
    match_field: string
  ): Promise<ApiResponse<T>> {
    try {
      console.log('data', data);
      const { data: result, error } = await this.supabase
        .from(table)
        .upsert(data)
        .select()
        .single();

      console.log('result', error);

      if (error) throw error;
      if (!result) throw new Error('Failed to upsert record');

      return {
        success: true,
        data: result as T,
      };
    } catch (error: any) {
      console.log('error', error);
      return {
        success: false,
        error: {
          message: error.message || 'Failed to upsert record',
          code: error.code,
          details: error,
        },
      };
    }
  }

  /**
   * Delete a record by ID
   */
  async delete(table: string, id: string | number): Promise<ApiResponse<void>> {
    try {
      const { error } = await this.supabase.from(table).delete().eq('id', id);

      if (error) throw error;

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to delete record',
          code: error.code,
          details: error,
        },
      };
    }
  }

  /**
   * Execute a custom query using the query builder
   */
  async customQuery<T>(
    table: string,
    queryBuilder: (query: any) => any
  ): Promise<ApiResponse<T[]>> {
    try {
      const baseQuery = this.supabase.from(table).select('*');
      const { data, error } = await queryBuilder(baseQuery);

      if (error) throw error;

      return {
        success: true,
        data: data as T[],
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || 'Failed to execute custom query',
          code: error.code,
          details: error,
        },
      };
    }
  }

}