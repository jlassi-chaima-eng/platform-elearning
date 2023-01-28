
var google =require('googleapis')

var fs =require('fs')
const path = require('path')
   exports.authenticateGoogle = () => {
        const auth = new google.auth.GoogleAuth({
          keyFile: `${__dirname}/services/upload-files-355309-2f8198337a11.json`,
          scopes: "https://www.googleapis.com/auth/drive",
        });
        return auth;
      };
    exports.uploadToGoogleDrive = async (file) => {
        const fileMetadata = {
            name: file.originalname,
          parents: ["1x1K0FuhxW2t0CtVUGe-96zBnIsr4syBt"], // Change it according to your desired parent folder id
        };
      
        const media = {
          mimeType: file.mimetype,
          body: fs.createReadStream(file.path),
        };
      
        const driveService = google.drive({ version: "v3", auth });
      
        const response = await driveService.files.create({
          requestBody: fileMetadata,
          media: media,
          fields: "id",
        });
        return response;
      };

