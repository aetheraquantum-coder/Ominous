const assert=require('node:assert/strict');
function assertNoPrivate(text) {
 assert.equal(typeof text,'string');
 assert.equal(text.includes('OMINOUS_PRIVATE_'),false,'Private fixture marker reached public content');
 for(const key of ['"private"','"debugTrace"']) assert.equal(text.includes(key),false,'Private fixture key reached public content');
}
module.exports={assertNoPrivate};
