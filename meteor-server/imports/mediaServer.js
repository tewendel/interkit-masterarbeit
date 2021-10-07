import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
const _fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: '/tmp' }) // Temp dir for multer

const getMP3Duration = require('get-mp3-duration')

require('dotenv').config({
  path: `${process.env.PWD}/.env`
})
import { v4 as uuidv4 } from 'uuid';

export const MediaFiles = new FilesCollection({
  collectionName: 'mediafiles',
  allowClientCode: false, // Disallow remove files from Client
  storagePath: `${process.env.MEDIAFILES_PATH}`,
  responseHeaders(responseCode, fileRef, versionRef, version, http) {
    const headers = {};
    switch (responseCode) {
      case '206':
        headers['Pragma'] = 'private';
        headers['Transfer-Encoding'] = 'chunked';
        break;
      case '400':
        headers['Cache-Control'] = 'no-cache';
        break;
      case '416':
        headers['Content-Range'] = 'bytes */' + versionRef.size;
    }
    headers['Connection'] = 'keep-alive';
    headers['Content-Type'] = versionRef.type || 'application/octet-stream';
    headers['Accept-Ranges'] = 'bytes';
    headers['Access-Control-Allow-Origin'] = '*';// <-- Custom header
    return headers;
  },
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg|mp3/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image or mp3, with size equal or less than 10MB';
  }
});

MediaFiles.writeSync = Meteor.wrapAsync(MediaFiles.write, MediaFiles.writeSync);

// MediaFiles.collection.attachSchema(new SimpleSchema(Images.schema)); // https://github.com/VeliovGroup/Meteor-Files/wiki/Schema

export const getMediaFiles = ({projectId}) => {
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
    "mediafiles.get": ({projectId})=>{
      let cursor = getMediaFiles({projectId})
      return cursor?.fetch();
    },
    "mediafile.get": ({key, projectId}) => {
      //console.log("getMediaFile", mediafileId)
      if(key && projectId) {
        let mediafileInstance = MediaFiles.findOne({'meta.key': key, 'meta.projectId': projectId})
        if(mediafileInstance) {
          let mediafileObj = {
            ...mediafileInstance.get(),
            link: mediafileInstance.link()
          }
          return mediafileObj;
        } else {
          return null;
        }
      }
    },
    "mediafile.delete": ({key, projectId}) => {
      if(key && projectId && Meteor.userId()) {
        console.log("mediafile.delete", key, projectId)
        MediaFiles.remove({'meta.key': key, 'meta.projectId': projectId})
      }
    }
  })
}

export const setupMediaServer = (app) => {

  app.post('/mediaUpload', upload.single('mediafile'), async (req, res) => {

    /*res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");*/
    
    if (req.file !== undefined /*&& req.file.mimetype.substr(0, 6) == 'image/'*/) {
    
        _fs.stat(req.file.path, function (_statError, _statData) { 
          _fs.readFile(req.file.path, function (_readError, _readData) {
            if (_readError) {
              console.log(_readError);
              res.status(500).json({error: "internal server error"})
            } else {

              let duration;
              console.log(req.file)
              if(req.file.mimetype == "audio/mpeg") {
                duration = getMP3Duration(_readData)
                console.log("getMp3Duration", duration);
              }

              const meta = {
                projectId: req.body.projectId,
                key: uuidv4(),
                duration
              }

              const _addFileMeta = {
                fileName: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size,
                meta
              };

              MediaFiles.write(_readData, _addFileMeta, function (_uploadError, _uploadData) {
                if (_uploadError) {
                  console.log(_uploadError);
                  res.status(500).json({ error: "upload error" })
                } else {
                  console.log('upload data=', _uploadData); 
                  //_fs.unlink(req.file.path); // remove temp upload
                  res.status(200).json({ ...meta })
                }
              });
            }
          });
        });  
    }
    //res.end();
  });
}

// check that all audios have duration and add if needeed
let audios = MediaFiles.find({type: "audio/mpeg", "meta.duration": {$exists: false}}).fetch();
for(let audio of audios) {
  const buffer = _fs.readFileSync(audio.path)
  const duration = getMP3Duration(buffer)
  console.log("adding duration to audio", audio, duration)
  MediaFiles.update({_id: audio._id}, {$set: {meta: { ...audio.meta, duration }}});
}


