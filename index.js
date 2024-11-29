const { getStatus } = require("mc-server-status")
const { ping } = require('bedrock-protocol');
const q = require('daskeyboard-applet');
const logger = q.logger;

class MinecraftStatus extends q.DesktopApp {
    constructor() {
        super();
        // run every 10 seconds
        this.pollingInterval = 10000;
    }

    // Function to get Minecraft server status.
    async getMinecraftStatus(host, port, type) {
        const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
        logger.info(`Checking ${typeCapitalized} server: ${host}:${port}`);
        try {
            port = parseInt(port);
            let res = type === 'java' ? await getStatus(host, port) : await ping({ host, port });
            logger.info(`Response from ${typeCapitalized} Minecraft Server: ${JSON.stringify(res)}`);
            return res;
        } catch (err) {
            logger.warn(`Error while getting ${typeCapitalized} Minecraft Server details: ${err}`);
            return false;
        }
    }

    generateSignal(serverStatus, onlineColour, offlineColour) {
        // If server is live/if there are any results.
        if (serverStatus) {
            const online = serverStatus.players ? serverStatus.players.online : serverStatus.playersOnline;
            const maxPlayers = serverStatus.players ? serverStatus.players.max : serverStatus.maxPlayers;
            const motd = serverStatus.description ? serverStatus.description.text : serverStatus.motd;
            //+1 is the server online indicator. Remaining entries are people online.
            const max = Math.min(online, 11) + 1;//TODO change this to support max players
            // Populate list of points based on number of players, can't have more than 10 though.
            // Populate remaining spaces with offline colors.
            const pointsList = Array.from({ length: 11 }, (_, i) => i < max ? new q.Point(onlineColour) : new q.Point(offlineColour));
            return new q.Signal({
                points: [pointsList],
                name: "Minecraft server online!",
                message: `${this.config.serverAddress} is online. | ${online}/${maxPlayers} | ${motd}`,
            });
        } else {
        // If Server is offline.
            return new q.Signal({
                points: [
                    Array.from({ length: 11 }).fill(new q.Point(offlineColour)),
                ],
                name: "Minecraft server offline!",
                message: `${this.config.serverAddress} is offline.`
            });
        }};

    async run() {

        const onlineColour = this.config.onlineColour;
        const offlineColour = this.config.offlineColour;
        const serverAddress = this.config.serverAddress;
        const serverPort = parseInt(this.config.serverPort);
        const serverType = this.config.serverType || 'java';

        if (serverAddress) {
            return this.getMinecraftStatus(serverAddress, serverPort, serverType).then(serverStatus => {
                return this.generateSignal(serverStatus, onlineColour, offlineColour);
            }).catch((err) => {
                logger.error(`Error while getting server status: ${err}`);
                return this.generateSignal(false, onlineColour, offlineColour);
            });
        } else {
            return this.generateSignal(false, onlineColour, offlineColour);
        }
    }
}

module.exports = {
  MinecraftStatus: MinecraftStatus
};

const applet = new MinecraftStatus();
