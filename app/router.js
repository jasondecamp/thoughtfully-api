'use strict';

const Nodal = require('nodal');
const router = new Nodal.Router();

/* Middleware */
/* executed *before* Controller-specific middleware */

const CORSMiddleware = Nodal.require('middleware/cors_middleware.js');
const ForceHTTPSMiddleware = Nodal.require('middleware/force_https_middleware.js');

router.middleware.use(CORSMiddleware);
router.middleware.use(ForceHTTPSMiddleware);

/* Renderware */
/* executed *after* Controller-specific renderware */

const GzipRenderware = Nodal.require('renderware/gzip_renderware.js')

router.renderware.use(GzipRenderware);

/* Routes */

const IndexController = Nodal.require('app/controllers/index_controller.js');

/* generator: begin imports */

const LoginController = Nodal.require('app/controllers/api/login_controller.js');
const LogoutController = Nodal.require('app/controllers/api/logout_controller.js');
const PasswordResetController = Nodal.require('app/controllers/api/password_reset_controller.js');
const UsersController = Nodal.require('app/controllers/api/users_controller.js');
const OauthUsersController = Nodal.require('app/controllers/api/oauth_users_controller.js');
const ThoughtsController = Nodal.require('app/controllers/api/thoughts_controller.js');

/* generator: end imports */

router.route('/').use(IndexController);

/* generator: begin routes */

router.route('/api/login').use(LoginController);
router.route('/api/logout').use(LogoutController);
router.route('/api/password_reset').use(PasswordResetController);
router.route('/api/users/{id}').use(UsersController);
router.route('/api/oauth_users/{id}').use(OauthUsersController);
router.route('/api/thoughts/{id}').use(ThoughtsController);

/* generator: end routes */

module.exports = router;
