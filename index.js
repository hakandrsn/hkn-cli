#!/usr/bin/env node

import {Command} from 'commander';
import open from 'open';
import axios from 'axios';
import {configDotenv} from "dotenv";
import {checkNodeInstalled, installNodeJS} from "./helpers.js";
import {installGlobalPackages} from "./install-packages.js";

configDotenv();

const program = new Command();


// Node.js'in kurulu olup olmadığını kontrol et


program.name('hkn').description('CLI tools for hakan').version('1.0.0');

program
    .command('game <app>')
    .description('Start specified app')
    .action(async (app) => {
        switch (app) {
            case 'cs2':
                console.log('CS2 oyunu Steam üzerinden başlatılıyor...');
                await open('steam://run/730');
                break;
            case 'cq':
                console.log('Conqurers blade başlatılıyor...');
                await open('steam://run/835570');
                break;
            case 'bf':
                console.log('Battlefield başlatılıyor...');
                await open('steam://run/1238810');
                break;
            default:
                console.log(`${app} uygulaması bulunamadı.`);
        }
    });

program.command('kvp <episode>')
    .description("Kurtlar vadisini izlemek istediğin bölümü yaz")
    .action(async (episode) => {
        const apiKey = process.env.YOUTUBE_API_KEY;
        const searchQuery = 'Kurtlar vadisi pusu' + episode;

        try {
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchQuery}&key=${apiKey}`);
            const videoId = response.data.items[0].id.videoId;
            open(`https://www.youtube.com/watch?v=${videoId}`);
        } catch (error) {
            console.error('Bir hata oluştu', error);
        }
    })

program.command('search <query>')
    .description("Youtube search")
    .action(async (episode) => {
        const apiKey = process.env.YOUTUBE_API_KEY;

        try {
            const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${episode}&key=${apiKey}`);
            const videoId = response.data.items[0].id.videoId;
            open(`https://www.youtube.com/watch?v=${videoId}`);
        } catch (error) {
            console.error('Bir hata oluştu', error);
        }
    })

program.command('setup js')
    .description("Javascript için gerekli paketleri yükler")
    .action(async () => {
            const nodeInstalled = await checkNodeInstalled();
            if (!nodeInstalled) {
                await installNodeJS();
            } else {
                console.log('Node.js zaten yüklü.');
            }
            try {
                await installGlobalPackages();
                console.log("Paketler başarıyla yüklendi.");
            } catch (error) {
                console.error("Paket yükleme hatası:", error.message);
            }
        }
    )

program.command("test").action(
    () => {
        console.log("Test edilecek bir şey yok");
    }
)

program.parse(process.argv);
//youtube api key   AIzaSyDWSHJSWnbJ0JeUIGwBSTw7dypdty62Tls