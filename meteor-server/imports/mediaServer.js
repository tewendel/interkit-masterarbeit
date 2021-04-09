import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

const MediaFiles = new FilesCollection({
  collectionName: 'mediafiles',
  allowClientCode: false, // Disallow remove files from Client
  storagePath: `${process.env.MEDIAFILES_PATH}`,
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg|mp3/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image or mp3, with size equal or less than 10MB';
  }
});

if (Meteor.isServer) {
  Meteor.publish('mediafiles', function (projectId) {
    console.log("subscribe mediafiles", projectId)
    return MediaFiles.find({ "meta.projectId": projectId }).cursor;
    //return MediaFiles.find({}).cursor
  });
}


const _fs = require('fs');
const multer  = require('multer');
const upload = multer({ dest: '/tmp' }) // Temp dir for multer

export const setupMediaServer = (app) => {

  app.post('/mediaUpload', upload.single('mediafile'), async (req, res) => {
       
    if (req.file !== undefined /*&& req.file.mimetype.substr(0, 6) == 'image/'*/) {
     
        _fs.stat(req.file.path, function (_statError, _statData) { 
          const _addFileMeta = {
            fileName: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
            meta: {
              projectId: req.body.projectId
            }
          };

          _fs.readFile(req.file.path, function (_readError, _readData) {
            if (_readError) {
              console.log(_readError);
            } else {
              MediaFiles.write(_readData, _addFileMeta, function (_uploadError, _uploadData) {
                if (_uploadError) {
                  console.log(_uploadError);
                } else {
                  console.log('upload data=', _uploadData); 
                  //_fs.unlink(req.file.path); // remove temp upload
                }
              });
            }
          });
        });  
    }
    //res.end();
  });
}



