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
  
    class WorkersKVREST {
      constructor(options: WorkersKVRESTOptions);
  
      listKeys(options: ListKeysOptions): Promise<any>;
      listAllKeys(options: ListAllKeysOptions): Promise<any>;
      listNamespaces(options: ListNamespacesOptions): Promise<any>;
      readKey(options: ReadKeyOptions): Promise<any>;
      deleteKey(options: DeleteKeyOptions): Promise<any>;
      writeKey(options: WriteKeyOptions): Promise<any>;
      writeMultipleKeys(options: WriteMultipleKeysOptions): Promise<any>;
      deleteMultipleKeys(options: DeleteMultipleKeysOptions): Promise<any>;
    }
  
    export = WorkersKVREST;
  }
  