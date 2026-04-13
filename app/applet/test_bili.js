const bvid = 'BV1FPEjeiEff';
const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;

async function test() {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`);
    const data = await res.json();
    console.log("allorigins:", data.contents.substring(0, 100));
  } catch (e) {
    console.error("allorigins failed", e.message);
  }

  try {
    const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(apiUrl)}`);
    const data = await res.json();
    console.log("codetabs:", data.data ? data.data.pic : 'no pic');
  } catch (e) {
    console.error("codetabs failed", e.message);
  }
}
test();
