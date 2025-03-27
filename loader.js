// Create this loader.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Now you can use both
import express from 'express';
const otherModule = require('./other-module.cjs');