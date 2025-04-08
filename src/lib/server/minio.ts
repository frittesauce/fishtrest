import { env } from '$env/dynamic/private';
import { Client } from 'minio';

const minioClient = new Client({
	endPoint: 'localhost',
	port: 9000,
	useSSL: false,
	accessKey: env.MINIO_ROOT_USER,
	secretKey: env.MINIO_ROOT_PASSWORD
});

module.exports = minioClient;
