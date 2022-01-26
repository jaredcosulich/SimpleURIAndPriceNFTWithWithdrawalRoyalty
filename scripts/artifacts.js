const fs = require('fs');
const hardhat = require("hardhat")

const getPath = async(name) => {
  const artifact = await hardhat.artifacts.readArtifact(name)
  
  fs.writeFile('compiled.json', JSON.stringify(artifact), function(err) {
      if (err) throw err;
      console.log('Compiled & saved');
  });
}
getPath(process.argv[2])