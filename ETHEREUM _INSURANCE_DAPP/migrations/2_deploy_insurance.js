const insurance = artifacts.require("insurance");

module.exports = function (deployer) {
  deployer.deploy(insurance,"0x00");
};
