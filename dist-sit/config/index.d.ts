export declare const config: {
    readonly nodeEnv: string;
    readonly port: number;
    readonly isProduction: boolean;
    readonly whatsapp: {
        readonly token: string;
        readonly phoneNumberId: string;
        readonly verifyToken: string;
        readonly testMode: boolean;
        readonly apiVersion: string;
    };
    readonly db: {
        readonly host: string;
        readonly port: number;
        readonly user: string;
        readonly password: string;
        readonly name: string;
    };
    readonly ai: {
        readonly provider: "openai" | "bedrock" | "none";
        readonly openai: {
            readonly apiKey: string;
            readonly model: string;
        };
        readonly bedrock: {
            readonly region: string;
            readonly model: string;
            readonly maxTokens: number;
        };
    };
    readonly storage: {
        readonly provider: "local" | "s3";
        readonly s3: {
            readonly bucket: string;
            readonly region: string;
        };
    };
    readonly subscription: {
        readonly enabled: boolean;
    };
};
