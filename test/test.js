const assert = require('assert');
const t = require('../index');
const q = require('daskeyboard-applet');
const config0Players = require('./config-0-players.json')
const config1Player = require('./config-1-player.json')
const config10Players = require('./config-10-players.json')
const config0PlayersBedrock = require('./config-0-players-bedrock.json')
const config1PlayerBedrock = require('./config-1-player-bedrock.json')
const config10PlayersBedrock = require('./config-10-players-bedrock.json')


describe('MinecraftStatus', function () {
  let app = new t.MinecraftStatus();

  describe('#getMinecraftStatus()', function () {
    it('gets Minecraft Java server status', function () {
      app.getMinecraftStatus(config0Players.applet.user.serverAddress, config0Players.applet.user.serverPort, config0Players.applet.user.serverType).then(res => {
        console.debug("Minecraft Java Server Response: " + JSON.stringify(res));
          // Test if target is an online Minecraft Java server by checking if this value exists and is a number.
          assert.equal(res.players.online, "number")
      })
    })
  });

  describe('#generateSignal()', function () {
    it('generates a q signal for an offline Java server', function() {
      let signal = app.generateSignal(false, config0Players.applet.user.onlineColour, config0Players.applet.user.offlineColour)
      //console.debug("Generated signal: ", signal)
      assert.ok(signal)
    }),

    it('generates a q signal for a Java server with 0 players', function() {
      let signal = app.generateSignal(config0Players, config0Players.applet.user.onlineColour, config0Players.applet.user.offlineColour)
      //console.debug("Generated signal: ", signal)
      assert.equal(JSON.stringify(signal.points[0][1].color), '"' + config1Player.applet.user.offlineColour + '"')
    }),

    it('generates a q signal for a Java server with 1 player', function() {
      let signal = app.generateSignal(config1Player, config1Player.applet.user.onlineColour, config1Player.applet.user.offlineColour)
      //console.debug("Generated signal: ", signal)
      assert.equal(JSON.stringify(signal.points[0][0].color), '"' + config1Player.applet.user.onlineColour + '"')
    }),

    it('generates a q signal for a Java server with 10 players', function() {
      let signal = app.generateSignal(config10Players, config10Players.applet.user.onlineColour, config10Players.applet.user.offlineColour)
      //console.debug("Generated signal: ", signal)
      assert.equal(JSON.stringify(signal.points[0][9].color), '"' + config10Players.applet.user.onlineColour + '"')
    })
  });

  describe('#getMinecraftStatus() for Bedrock', function () {
    it('gets Bedrock Minecraft server status', function () {
      app.getMinecraftStatus(config0PlayersBedrock.applet.user.serverAddress, config0PlayersBedrock.applet.user.serverPort, config0PlayersBedrock.applet.user.serverType).then(res => {
        console.debug("Bedrock Minecraft Server Response: " + JSON.stringify(res));
          // Test if target is an online Bedrock Minecraft server by checking if this value exists and is a number.
          assert.equal(res.players.online, "number")
      })
    })
  });

  describe('#generateSignal() for Bedrock', function () {
    it('generates a q signal for an offline Bedrock server', function() {
      let signal = app.generateSignal(false, config0PlayersBedrock.applet.user.onlineColour, config0PlayersBedrock.applet.user.offlineColour)
      //console.debug("Generated signal: ", signal)
      assert.ok(signal)
    }),
    
    it('generates a q signal for a Bedrock server with 0 players', function() {
      let signal = app.generateSignal(config0PlayersBedrock, config0PlayersBedrock.applet.user.onlineColour, config0PlayersBedrock.applet.user.offlineColour)
      //console.debug("Generated signal: ", signal)
      assert.equal(JSON.stringify(signal.points[0][1].color), '"' + config1PlayerBedrock.applet.user.offlineColour + '"')
    }),
    
    it('generates a q signal for a Bedrock server with 1 player', function() {
      let signal = app.generateSignal(config1PlayerBedrock, config1PlayerBedrock.applet.user.onlineColour, config1PlayerBedrock.applet.user.offlineColour)
      //console.debug("Generated signal: ", signal)
      assert.equal(JSON.stringify(signal.points[0][0].color), '"' + config1PlayerBedrock.applet.user.onlineColour + '"')
    }),
    
    it('generates a q signal for a Bedrock server with 10 players', function() {
      let signal = app.generateSignal(config10PlayersBedrock, config10PlayersBedrock.applet.user.onlineColour, config10PlayersBedrock.applet.user.offlineColour)
      //console.debug("Generated signal: ", signal)
      assert.equal(JSON.stringify(signal.points[0][9].color), '"' + config10PlayersBedrock.applet.user.onlineColour + '"')
    })
  });
})
