const https = require('https');
https.get('https://www.xinpianchang.com/user/project/iframe?id=12569641', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  console.log("Status:", res.statusCode);
  console.log("Headers:", res.headers);
});
