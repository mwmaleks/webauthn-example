import errorhandler from 'errorhandler';
import nodeNotifier from 'node-notifier';
import logger from './utils/logger';

import app from './app';

app.use(errorhandler());
/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
    logger.info(
        'WebAuthn server is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env'),
    );
    logger.info('Press CTRL-C to stop\n');
    nodeNotifier.notify({
        title: 'WebAuthn Example',
        message: 'WebAuthn Example working',
    });
});

export default server;
