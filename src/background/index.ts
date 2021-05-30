import { ServerConnection } from '../shared/ServerConnection';

import { BackgroundRemoteActionReciever } from './BackgroundRemoteActionReciever';
import { createContextMenu } from './ContextMenu';

(function main() {
    createContextMenu();

    browser.runtime.onConnect.addListener((portToSender) => {
        const service = new BackgroundRemoteActionReciever();
        const server = new ServerConnection(portToSender, service);
        server.run();
    });
})();
