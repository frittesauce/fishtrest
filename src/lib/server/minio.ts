import { env } from '$env/dynamic/private';
import { Client } from 'minio';

export const minioClient = new Client({
	endPoint: '172.18.0.2',
	port: 9000,
	useSSL: false,
	accessKey: env.MINIO_ROOT_USER,
	secretKey: env.MINIO_ROOT_PASSWORD
});
