import express from 'express';
import { get_compile } from './src/get_compile.mjs'
import { get_app_files } from './src/get_app_files.mjs'
import cors from 'cors';

const PORT = process.env.PORT

const app = express();

app.use(cors())

app.use(express.static('public', {index: false}))

// compile a bundle for a given app
app.get('/compile/:projectId', get_compile)

//app.use(express.static('public', { index: false }))

app.use(get_app_files);

app.listen(PORT, () => console.log('listening on port ' + PORT)); 

