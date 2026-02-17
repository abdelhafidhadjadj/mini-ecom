// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
    	interface Locals {
    	  user?: JWTPayload;
    	}
	
    	interface PageData {
    	  user?: JWTPayload | null;
    	}
	
    	interface Error {
    	  message: string;
    	  code?: string;
    	}
	}
}

export {};
