import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private baseFolder: string = path.join(__dirname, '..', '..', 'uploads');
  private baseUrl: string = process.env.APP_BASE_URL || 'http://localhost:5000';

  constructor() {
    if (!fs.existsSync(this.baseFolder)) {
      fs.mkdirSync(this.baseFolder, { recursive: true });
    }
  }

  async getListObjects(prefix: string): Promise<any[]> {
    const folderPath = path.join(this.baseFolder, prefix);
    try {
      const files = await fs.promises.readdir(folderPath);
      return files;
    } catch (error) {
      return [];
    }
  }

  async saveFiles(
    file: Express.Multer.File,
    parentFolder: string,
    moduleID: number = 0,
  ): Promise<{
    file: string;
    thumbnail: string;
    fileDecode: string;
    thumbnailDecode: string;
  }> {
    const uniqueFilename: string = `${uuidv4()}.${this.getMime(file?.originalname)}`;
    const subFolder: string = moduleID > 0 ? `/${moduleID}` : '';
    const folderPath = path.join(this.baseFolder, parentFolder, subFolder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, uniqueFilename);

    try {
      await fs.promises.writeFile(filePath, new Uint8Array(file.buffer));
      const publicUrl = `${this.baseUrl}/uploads/${parentFolder}${subFolder}/${uniqueFilename}`;

      return {
        file: uniqueFilename,
        fileDecode: publicUrl,
        thumbnail: '',
        thumbnailDecode: '',
      };
    } catch (error) {
      console.error('Error saving file:', error);
      throw new InternalServerErrorException('Failed to save file');
    }
  }

  getMime(filename: string): string {
    return filename.split('.').pop().split(/\#|\?/)[0];
  }

  async setBucketPolicy(): Promise<void> {
    return;
  }

  async deleteFile(
    filename: string,
    moduleID: string | number,
    parentFolder: string,
  ): Promise<void> {
    const filePath = path.join(
      this.baseFolder,
      parentFolder,
      String(moduleID),
      filename,
    );
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  linkGenerator(filename: string, folder: string): string {
    if (!filename) {
      return '';
    }
    return `${this.baseUrl}/uploads/${folder}/${filename}`;
  }
}
