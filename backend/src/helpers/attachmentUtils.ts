import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// Implement the fileStogare logic

export class AttachmentUtils{
    constructor(
        private readonly s3Client = new XAWS.S3({
            signatureVersion: 'v4'
        }),
        private readonly bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
    }      

    obtainS3AttachmentURL(todoId: string) : string{
        return `https://${this.bucketName}.s3.us-east-2.amazonaws.com/${todoId}.png`
    }

    obtainS3PreSignedUrl(todoId: string): string {
        return this.s3Client.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: todoId,
        Expires: this.urlExpiration
        })
    }
}