// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
    	interface Locals {
    	  user?: JWTPayload;
	      userB2B?: JWTPayloadB2B;
		}

    	interface PageData {
    	  user?: JWTPayload | null;
		  userB2B?: JWTPayloadB2B;

    	}

    	interface Error {
    	  message: string;
    	  code?: string;
    	}
	}
}

export {};
