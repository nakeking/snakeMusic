const express = require('express');
const config = require('./config/index.js');
const axios = require('axios');

const app = express()
var apiRoutes = express.Router()

  app.get('/api/getDiscList', function (req, res){
    var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

    axios.get(url, {
      headers:{
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    }).then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
    })
  });
  app.get('/api/getSongList', function(req, res){
    var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

    axios.get(url, {
      headers: {
        referer: 'https://y.qq.com/?ADTAG=myqq'
      },
      params: req.query
    }).then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
    })
  });
  app.get('/api/getTopList', function(req, res){
    var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

    axios.get(url, {
      headers: {
        referer: 'https://m.y.qq.com/'
      },
      params: req.query
    }).then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
    })
  });
  app.get('/api/search', function(req, res){
    var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

    axios.get(url, {
      headers:{
        referer: 'https://m.y.qq.com/'
      },
      params: req.query
    }).then((response) => {
      res.json(response.data)
    }).catch((err) => {
      console.log(err)
    })
  });
  app.get('/api/getSongLyric', function(req, res){
    var url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg"

    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    }).then((response) => {
      let ret = response.data;
      if(typeof ret === 'string'){
        let reg = /^\w+\(({[^()]+})\)$/
        let matches = ret.match(reg)
        if(matches){
          ret = JSON.parse(matches[1])
        }
      }
      res.json(ret)
    }).catch((err) => {
      console.log(err)
    })
  })

app.use('/api', apiRoutes);

app.use(express.static('./dist'));

var port = process.env.PORT || config.dev.port

module.exports = app.listen(port, function(err) {
	if(err){
		console.log(err);
		return
	}
	console.log('Listening at http://localhost:' + port + '\n');
})