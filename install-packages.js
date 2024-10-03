// Global olarak gerekli paketleri yükle
import {exec} from 'child_process';
import ora from 'ora';

export async function installGlobalPackages() {
    const spinner = ora('Global paketler yükleniyor...').start();
    const globalPackages = ['@nestjs/cli', 'dotenv', 'win-node-env'];
    const commandLine = globalPackages.map(i => `npm i --global ${i}`).toString().split(',').join(' ');
    return new Promise((resolve, reject) => {
        exec(commandLine, (error, stdout) => {
            if (error) {
                reject(error);
            } else {
                spinner.succeed('Global paketler başarıyla yüklendi.');
                console.log(stdout);
                resolve();
            }
        });
    });
}