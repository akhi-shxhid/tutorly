import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Custom error class for API requests
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      errorData = await res.text();
    }
    
    throw new APIError(
      errorData?.message || res.statusText,
      res.status,
      errorData
    );
  }
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function apiRequest(
  url: string,
  options?: RequestInit & { retries?: number },
): Promise<Response> {
  const retries = options?.retries ?? MAX_RETRIES;
  const hasFormData = options?.body instanceof FormData;
  
  const makeRequest = async (attempt: number): Promise<Response> => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: hasFormData 
          ? { ...options?.headers }
          : {
              "Content-Type": "application/json",
              ...options?.headers
            },
        body: hasFormData 
          ? options.body 
          : options?.body 
            ? JSON.stringify(options.body) 
            : undefined,
        credentials: "include",
      });

      await throwIfResNotOk(res);
      return res;
    } catch (error) {
      if (error instanceof APIError && error.status === 401) {
        throw error; // Don't retry auth errors
      }
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
        return makeRequest(attempt + 1);
      }
      throw error;
    }
  };

  return makeRequest(1);
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(
        "Failed to fetch data",
        500,
        { originalError: error }
      );
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: (failureCount, error) => {
        if (error instanceof APIError && error.status === 401) {
          return false; // Don't retry auth errors
        }
        return failureCount < MAX_RETRIES;
      },
    },
    mutations: {
      retry: false,
    },
  },
});