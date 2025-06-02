import { Client } from 'minio';

export const exMinioClient = new Client({
	endPoint: 'localhost',
	port: 9000,
	useSSL: false,
	accessKey: 'skibidislicer',
	secretKey: 'rootpassword'
});
