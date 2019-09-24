import helmet from 'helmet'

const {
  APP_DISABLE_HELMET,
  APP_DISABLE_HELMET_HSTS,
  APP_DISABLE_HELMET_CACHE_CONTROL,
  APP_DISABLE_HELMET_CROSS_DOMAIN,
  APP_DISABLE_HELMET_HIDE_POWERED_BY,
} = process.env;

const helmetMiddleware = () => {
  const middlewares = [];

  if (APP_DISABLE_HELMET !== 'true') {
    if (APP_DISABLE_HELMET_HSTS !== 'true') {
      middlewares.push(helmet.hsts());
    }
    if (APP_DISABLE_HELMET_CACHE_CONTROL !== 'true') {
      middlewares.push(helmet.noCache());
    }
    if (APP_DISABLE_HELMET_CROSS_DOMAIN !== 'true') {
      middlewares.push(helmet.permittedCrossDomainPolicies());
    }
    if (APP_DISABLE_HELMET_HIDE_POWERED_BY !== 'true') {
      middlewares.push(helmet.hidePoweredBy());
    }
  }

  return middlewares;
}

export default helmetMiddleware;
