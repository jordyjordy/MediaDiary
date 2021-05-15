declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SERVER_PORT: number,
            DB_HOST: string,
            DB_DATABASE: string
        }
    }
}

export { }