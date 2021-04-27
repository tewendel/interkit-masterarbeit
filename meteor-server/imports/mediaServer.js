import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
const _fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: '/tmp' }) // Temp dir for multer

require('dotenv').config({
  path: `${process.env.PWD}/.env`
})
import { v4 as uuidv4 } from 'uuid';

export const MediaFiles = new FilesCollection({
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

MediaFiles.writeSync = Meteor.wrapAsync(MediaFiles.write, MediaFiles.writeSync);

export const getMediaFiles = (projectId) => {
  if(projectId)
    return MediaFiles.find({ "meta.projectId": projectId }).cursor;
  else 
    return null;
}

export const removeProjectMedia = projectId => {
  if (projectId)
    return MediaFiles.remove({ "meta.projectId": projectId });
  else
    return null;
}

export const duplicateProjectFile = async function(fileId, newProjectId=false) {
  const file = MediaFiles.findOne({_id: fileId})
  const projectId = file.meta.projectId

  console.log("duplicating file \"" + file.name + "\"" + (newProjectId ? " to new projectId " + newProjectId : " in project " + projectId))

  const data =  _fs.readFileSync(file.path);

  const newFile = MediaFiles.writeSync(data, {
    fileName: file.name,
    type: file.type,

    meta: {
      ...file.meta,
      projectId: newProjectId || projectId
    }
  }/*, (writeError, fileRef) => {
    if (writeError) {
      throw writeError;
    } else {
      console.log(`${fileRef.name} is successfully saved to FS. _id: ${fileRef._id}`);
    }
  }*/);

  return newFile
}

export const importProjectMediaFile = async function(fileBuffer, fileName, fileType,  projectId, fileMeta) {
  const newFile = MediaFiles.writeSync(fileBuffer, {
    fileName,
    type: fileType,
    meta: {
      ...fileMeta,
      projectId,
    }
  }, (writeError, fileRef) => {
    if (writeError) {
      throw writeError;
    } else {
      console.log(`${fileRef.name} is successfully saved to FS. _id: ${fileRef._id}`);
    }
  });
  return newFile
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

export const setupMediaServer = (app) => {

  app.post('/mediaUpload', upload.single('mediafile'), async (req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

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



