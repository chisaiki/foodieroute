

//declare env keys used
interface ImportMetaEnv {
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    // add other VITE_… variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}