#!/usr/bin/env node

import { Command } from 'commander';
import open from 'open';
const program = new Command();

program.name('hkn').description('CLI tools for hakan').version('1.0.0');

program
  .command('start <app>')
  .description('Start specified app')
  .action(async (app) => {
    if (app === 'cs2') {
      console.log('CS2 oyunu Steam üzerinden başlatılıyor...');
      await open('steam://run/730');
    } else if (app === 'music') {
      console.log('Müzik çalınıyor...');
      // Müzik çalma kodu buraya eklenebilir
    } else {
      console.log(`${app} uygulaması bulunamadı.`);
    }
  });

program.parse(process.argv);
