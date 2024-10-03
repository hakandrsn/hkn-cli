// Node.js'i indir ve yükle
import axios from "axios";
import os from 'os';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
export async function installNodeJS() {
    console.log('Node.js yüklü değil, indiriliyor...');
    const platform = os.platform();
    const nodeVersion = 'latest'; // En son sürümü indir

    let downloadUrl = '';

    if (platform === 'win32') {
        downloadUrl = `https://nodejs.org/dist/${nodeVersion}/node-${nodeVersion}-x64.msi`;
    } else if (platform === 'darwin') {
        downloadUrl = `https://nodejs.org/dist/${nodeVersion}/node-${nodeVersion}.pkg`;
    } else if (platform === 'linux') {
        downloadUrl = `https://nodejs.org/dist/${nodeVersion}/node-${nodeVersion}-linux-x64.tar.xz`;
    }

    const fileName = path.join(os.tmpdir(), path.basename(downloadUrl));

    const response = await axios({
        method: 'GET',
        url: downloadUrl,
        responseType: 'stream',
    });

    // Dosyayı yerel diske kaydet
    response.data.pipe(fs.createWriteStream(fileName));
    console.log(`Node.js indirildi: ${fileName}`);

    return new Promise((resolve, reject) => {
        response.data.on('end', () => {
            // Windows: MSI yükleyici çalıştır
            if (platform === 'win32') {
                exec(`msiexec /i ${fileName}`, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            }
            // Mac: PKG yükleyici çalıştır
            else if (platform === 'darwin') {
                exec(`sudo installer -pkg ${fileName} -target /`, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            }
            // Linux: Tar dosyasını aç ve path'i güncelle
            else if (platform === 'linux') {
                exec(`tar -xf ${fileName} -C /usr/local --strip-components=1`, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            }
        });

        response.data.on('error', (error) => {
            reject(error);
        });
    });
}

export function checkNodeInstalled() {
    return new Promise((resolve) => {
        exec('node -v', (error) => {
            if (error) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}