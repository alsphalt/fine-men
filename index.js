/**
 * Dark Angel Bot - Main Bot Client
 * Author: deadnote
 * 
 * Core bot client that manages Discord integration,
 * command loading, events, and database connections
 */

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const logger = require('./functions/logger');
const config = require('./config');

class DarkAngelBot extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.commands = new Collection();
    this.events = new Collection();
    this.cases = new Collection();
    this.cooldowns = new Collection();
    this.config = config;
    this.logger = logger;
  }

  /**
   * Initialize bot - load commands, events, connect to database
   */
  async initialize() {
    try {
      // Connect to MongoDB
      await this.connectDatabase();

      // Load commands
      await this.loadCommands();

      // Load events
      await this.loadEvents();

      // Load cases (handlers)
      await this.loadCases();

      // Login to Discord
      await this.login(this.config.discord.token);

      logger.success('✓ Dark Angel Bot initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize bot: ${error.message}`);
      throw error;
    }
  }

  /**
   * Connect to MongoDB
   */
  async connectDatabase() {
    try {
      await mongoose.connect(this.config.database.mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.success('✓ Connected to MongoDB');
    } catch (error) {
      logger.error(`Failed to connect to MongoDB: ${error.message}`);
      throw error;
    }
  }

  /**
   * Load all commands from commands directory
   */
  async loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');

    if (!fs.existsSync(commandsPath)) {
      fs.mkdirSync(commandsPath, { recursive: true });
      logger.warn('⚠ Commands directory created');
      return;
    }

    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);

      if (command.name && command.execute) {
        this.commands.set(command.name, command);
        logger.info(`✓ Loaded command: ${command.name}`);
      } else {
        logger.warn(`⚠ Command ${file} missing name or execute function`);
      }
    }
  }

  /**
   * Load all events from events directory
   */
  async loadEvents() {
    const eventsPath = path.join(__dirname, 'events');

    if (!fs.existsSync(eventsPath)) {
      fs.mkdirSync(eventsPath, { recursive: true });
      logger.warn('⚠ Events directory created');
      return;
    }

    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);

      if (event.name && event.execute) {
        this.events.set(event.name, event);

        if (event.once) {
          this.once(event.name, (...args) => event.execute(this, ...args));
        } else {
          this.on(event.name, (...args) => event.execute(this, ...args));
        }

        logger.info(`✓ Loaded event: ${event.name}`);
      } else {
        logger.warn(`⚠ Event ${file} missing name or execute function`);
      }
    }
  }

  /**
   * Load all cases (handlers) from cases directory
   */
  async loadCases() {
    const casesPath = path.join(__dirname, 'cases');

    if (!fs.existsSync(casesPath)) {
      fs.mkdirSync(casesPath, { recursive: true });
      logger.warn('⚠ Cases directory created');
      return;
    }

    const caseFiles = fs
      .readdirSync(casesPath)
      .filter((file) => file.endsWith('.js'));

    for (const file of caseFiles) {
      const filePath = path.join(casesPath, file);
      const caseModule = require(filePath);

      if (caseModule.name && caseModule.execute) {
        this.cases.set(caseModule.name, caseModule);
        logger.info(`✓ Loaded case: ${caseModule.name}`);
      }
    }
  }

  /**
   * Execute a command
   */
  async executeCommand(interaction) {
    const command = this.commands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({
        content: '❌ Command not found',
        ephemeral: true,
      });
    }

    try {
      await command.execute(this, interaction);
      logger.info(`✓ Command executed: ${command.name} by ${interaction.user.tag}`);
    } catch (error) {
      logger.error(`Error executing command ${command.name}: ${error.message}`);
      await interaction.reply({
        content: `❌ Error executing command: ${error.message}`,
        ephemeral: true,
      });
    }
  }

  /**
   * Get command by name
   */
  getCommand(name) {
    return this.commands.get(name);
  }

  /**
   * Register a command
   */
  registerCommand(command) {
    if (!command.name || !command.execute) {
      throw new Error('Command must have name and execute function');
    }
    this.commands.set(command.name, command);
    return command;
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      logger.warn('⚠ Shutting down bot...');
      await mongoose.disconnect();
      logger.success('✓ Disconnected from database');
      this.destroy();
      logger.success('✓ Bot shutdown complete');
    } catch (error) {
      logger.error(`Error during shutdown: ${error.message}`);
      throw error;
    }
  }
}

module.exports = DarkAngelBot;
