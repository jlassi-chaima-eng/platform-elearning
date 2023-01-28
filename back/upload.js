const fs = require('fs')
const { google } = require('googleapis')
const { GoogleAuth } = require('google-auth-library');

const GOOGLE_API_FOLDER_ID = '1EjwyR9nhxBhk7Lx9dp3AREXpvcJEyRIf'

async function uploadFile(){
    try{
        const auth = new GoogleAuth({
            keyFile: './googlekey.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        })

        const driveService = google.drive({
            version: 'v3',
            auth
        })

        const fileMetaData = {
            'name': 'file-1656940975703.jpg',
            'parents': [GOOGLE_API_FOLDER_ID]
        }

        const media = {
            mimeType: 'image/jpg',
            body: fs.createReadStream('./file-1656940975703.jpg')
        }

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
        return response.data.id

    }catch(err){
        console.log('Upload file error', err)
    }
}

uploadFile().then(data => {
    console.log(data)
    //https://drive.google.com/uc?export=view&id=
})