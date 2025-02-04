export interface ApiKey {
    name: string;
    description: string;
    url: string;
    key: string;
    supported_models: Set<string>;
}