import { env } from '$env/dynamic/private';
import { Client } from 'minio';

export const minioClient = new Client({
	endPoint: 'minio',
	port: 9000,
	useSSL: false,
	accessKey: env.MINIO_ROOT_USER,
	secretKey: env.MINIO_ROOT_PASSWORD
});
