import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import { v4 as uuidv4 } from 'uuid';

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

const getMediaFiles = (projectId) => {
  if(projectId)
    return MediaFiles.find({ "meta.projectId": projectId }).cursor;
  else 
    return null;
}

if (Meteor.isServer) {
  Meteor.publish('mediafiles', getMediaFiles);
  Meteor.methods({
    "mediafiles.get": (projectId)=>{
      let cursor = getMediaFiles(projectId)
      return cursor?.fetch();
    },
    "mediafile.get": ({key, projectId}) => {
      //console.log("getMediaFile", mediafileId)
      if(key && projectId) {
        let mediafileInstance = MediaFiles.findOne({'meta.key': key, 'meta.projectId': projectId})
        let mediafileObj = {
          ...mediafileInstance.get(),
          link: mediafileInstance.link()
        }
        return mediafileObj;
      }
    }
  })
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
              projectId: req.body.projectId,
              key: uuidv4()
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



