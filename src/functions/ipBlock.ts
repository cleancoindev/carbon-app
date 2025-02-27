import type { CFWorkerEnv } from 'functions/types';

export const isIpBlocked = (request: Request, env: CFWorkerEnv) => {
  const RESTRICTED_DOMAIN = 'carbon-app-csq.pages.dev';
  const { hostname } = new URL(request.url);
  const ALLOWED_IPS = env.ALLOWED_IPS;
  if (hostname === RESTRICTED_DOMAIN && ALLOWED_IPS) {
    const allowedIps = ALLOWED_IPS.split(',').filter((ip) => ip !== '');
    const clientIP = request.headers.get('CF-Connecting-IP') || '';
    if (!allowedIps.includes(clientIP)) {
      return new Response(`IP ${clientIP} isn't allowed to access this page`, {
        status: 403,
      });
    }
  }
};
