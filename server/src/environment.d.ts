declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SERVER_PORT: number,
            DB_HOST: string,
            DB_DATABASE: string,
            TOKEN_LENGTH: number

        }
    }
}

export { }