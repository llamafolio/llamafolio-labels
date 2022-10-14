const axios = require('axios');
const fs = require("fs")
const URL = 'https://api.compound.finance/api/v2/governance/accounts?page_size=10000&page_number=1&with_history=false&network=mainnet'

async function fetchDelegates() {


  const delegates = (await axios.get(URL)).data.accounts;
  const foundDelegates = []
  for (var i = 0; i < delegates.length; i++) {
    if (delegates[i].display_name !== null) {
      let delegate = {}
      // console.log(delegates[i])
      if ( delegates[i].account_url ) {
        if (delegates[i].account_url.includes("twitter")) {
          (delegate.links ??= {}).twitter ??= delegates[i].account_url
        } else if (delegates[i].account_url !== null) {
          (delegate.links ??= {}).website ??= delegates[i].account_url
        }
      }

      delegate.labels = [{ "type": "info", "value": delegates[i].display_name }, { "type": "info", "value": "Compound Delegate" }]
      console.log(delegates[i].display_name)


      foundDelegates[delegates[i].address.toLowerCase()] = delegate

    }
  }

  // console.log(foundDelegates.length)
  // console.log(foundDelegates)
  for (var key in foundDelegates) {

    let path = `./labels/${key}.json`
    if(!fs.existsSync(path)) {
      //address does not exist so write new address
      //fs.writeFileSync(path, JSON.stringify(foundDelegates[key], null, 2));
    } else {
      const rawDataFS = await fs.readFileSync(path, 'utf8');
      let existingLabels = JSON.parse(rawDataFS)
      for (var i = 0; i < existingLabels.length; i++) {
        let tLabel = existingLabels[i]
        //check duplicate labels
      }
    }

  }


}


fetchDelegates()
