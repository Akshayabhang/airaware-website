async function testApi() {
  const apiKey = 'sk-live-XPEhdPccNUFNppHMrpv7UltCbjq2MXV9CHnxeErP';

  const tryUrl = async (endpoint) => {
    try {
      const res = await fetch(endpoint, {
        headers: { 'x-api-key': apiKey }
      });
      console.log(`URL: ${endpoint} | Status:`, res.status);
      if (res.ok) {
        console.log(await res.text().then(t => t.substring(0, 1000)));
      }
    } catch (err) { }
  };

  await tryUrl('https://weather.indianapi.in/global/weather?location=Delhi');
  await tryUrl('https://weather.indianapi.in/global/weather?q=Delhi');
  await tryUrl('https://weather.indianapi.in/global/weather?location=Mumbai');
  await tryUrl('https://weather.indianapi.in/india/city_weather?city_name=Delhi');
}

testApi();
