import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as Minio from 'minio';

@Injectable()
export class UploadService {
  private readonly minioClient: Minio.Client;
  private readonly bucketName: string;
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: 'nos.wjv-1.neo.id',
      useSSL: false,
      secretKey: 'FMZHV8iLX8lFH80NaYJdEAe5ipVqQrFnzJL1Ml45',
      accessKey: '45cf5d421a015b63d5a5',
    });
    this.bucketName = 'nest-typescript';
  }

  async getListObjects(prefix: string): Promise<any[]> {
    const objects: any[] = [];

    return new Promise((resolve, reject) => {
      const stream = this.minioClient.listObjects(
        this.bucketName,
        prefix,
        true,
      );

      stream.on('data', (obj) => {
        objects.push(obj);
      });

      stream.on('end', () => {
        resolve(objects);
      });

      stream.on('error', (err) => {
        console.error('Error listing objects:', err);
        reject(err);
      });
    });
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
    const folderPath: string = `${parentFolder}${subFolder}`;
    const imageUploadPath: string = `${folderPath}/${uniqueFilename}`;

    await this.minioClient.putObject(
      this.bucketName,
      imageUploadPath,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    const filePath = `https://${process.env.S3_ENDPOINT}/${this.bucketName}/${imageUploadPath}`;

    this.setBucketPolicy();

    // kenapaada thumbnail, karena awalnya memang ada, ternyata server tidak suport karena version linuxnya dibawah standar.
    return {
      file: uniqueFilename,
      fileDecode: filePath,
      thumbnail: '',
      thumbnailDecode: '',
    };
  }

  getMime(filename: string): string {
    return filename.split('.').pop().split(/\#|\?/)[0];
  }

  async setBucketPolicy(): Promise<void> {
    try {
      const bucketPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Action: ['s3:GetBucketLocation'],
            Effect: 'Allow',
            Principal: {
              AWS: ['*'],
            },
            Resource: [`arn:aws:s3:::${this.bucketName}`],
            Sid: '',
          },
          {
            Action: ['s3:ListBucket'],
            Effect: 'Allow',
            Principal: {
              AWS: ['*'],
            },
            Resource: [`arn:aws:s3:::${this.bucketName}`],
            Sid: '',
          },
          {
            Action: ['s3:GetObject'],
            Effect: 'Allow',
            Principal: {
              AWS: ['*'],
            },
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            Sid: '',
          },
        ],
      };
      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(bucketPolicy),
      );
      console.log(`Policy set for bucket ${this.bucketName}`);
    } catch (error) {
      console.error('Error setting bucket policy:', error);
      throw new InternalServerErrorException('Failed to set bucket policy');
    }
  }

  async deleteFile(
    filename: string,
    moduleID: string | number,
    parentFolder: string,
  ): Promise<void> {
    const filePath = `${parentFolder}/${moduleID}/${filename}`;
    console.log(filePath);

    await this.minioClient.removeObject(this.bucketName, filePath);
  }

  linkGenerator(filename: string, folder: string): string {
    if (!filename) {
      return '';
    }
    return `https://${process.env.S3_ENDPOINT}/${this.bucketName}/${folder}/${filename}`;
  }
}
