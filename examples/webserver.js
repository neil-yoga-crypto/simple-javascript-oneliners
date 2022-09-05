import { startServer } from '../collections/express/simpleexpress.js';
startServer(3000).get('/',(req,res) => { res.send('get'); });

