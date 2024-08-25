declare module "@sagi.io/workers-kv" {
  interface WorkersKVRESTOptions {
    cfAccountId: string;
    cfEmail?: string;
    cfAuthKey?: string;
    cfAuthToken?: string;
    namespaceId?: string;
  }

  interface ListKeysOptions {
    namespaceId?: string;
    limit?: number;
    cursor?: string;
    prefix?: string;
  }

  interface ListAllKeysOptions {
    namespaceId?: string;
    prefix?: string;
    limit?: number;
  }

  interface ListNamespacesOptions {
    page?: number;
    per_page?: number;
  }

  interface ReadKeyOptions {
    key: string;
    namespaceId?: string;
  }

  interface DeleteKeyOptions {
    key: string;
    namespaceId?: string;
  }

  interface WriteKeyOptions {
    key: string;
    value: string;
    namespaceId?: string;
    expiration?: number;
    expiration_ttl?: number;
  }

  interface WriteMultipleKeysOptions {
    keyValueMap: Record<string, string>;
    namespaceId?: string;
    expiration?: number;
    expiration_ttl?: number;
    base64?: boolean;
  }

  interface DeleteMultipleKeysOptions {
    keys: string[];
    namespaceId?: string;
  }

  interface Response {
    result: null;
    success: boolean;
    errors: {
      code: number;
      message: string;
    }[];
    messages: {
      code: number;
      message: string;
    }[];
  }

  interface ReadResponse extends Omit<Response, "result"> {
    result: string;
  }

  interface ListResponse extends Omit<Response, "result"> {
    result: { expiration?: number; metadata?: object; key: string }[];
    result_info: {
      count: number;
      cursor: string;
    };
  }

  interface ListNamespacesResponse extends Omit<Response, "result"> {
    result: { id: string; supports_url_encoding?: boolean; title: string }[];
    result_info: {
      count: number;
      page: number;
      per_page: number;
      total_count: number;
    };
  }

  class WorkersKVREST {
    constructor(options: WorkersKVRESTOptions);

    listKeys(options: ListKeysOptions): Promise<ListResponse>;
    listAllKeys(options: ListAllKeysOptions): Promise<ListResponse>;
    listNamespaces(
      options: ListNamespacesOptions,
    ): Promise<ListNamespacesResponse>;
    readKey(options: ReadKeyOptions): Promise<ReadResponse>;
    deleteKey(options: DeleteKeyOptions): Promise<Response>;
    writeKey(options: WriteKeyOptions): Promise<Response>;
    writeMultipleKeys(options: WriteMultipleKeysOptions): Promise<Response>;
    deleteMultipleKeys(options: DeleteMultipleKeysOptions): Promise<Response>;
  }

  export = WorkersKVREST;
}
