#!/usr/bin/env node
/**
 * CLI Entry Point
 */

import { SolanaMCPServer } from './server.js';

const server = new SolanaMCPServer();
server.run();
