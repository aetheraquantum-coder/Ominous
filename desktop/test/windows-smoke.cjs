const { _electron: electron, expect } = require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');const path=require('node:path');const os=require('node:os');
(async()=>{
 const data=await fs.mkdtemp(path.join(os.tmpdir(),'ominous-smoke-'));
 const output=path.resolve('dist/windows-evidence');await fs.mkdir(output,{recursive:true});
 const executablePath=process.env.OMINOUS_TEST_EXE||path.resolve('dist/win-unpacked/Ominous.exe');
 const results=[];let app;
 const launch=()=>electron.launch({executablePath,args:['--ominous-data='+data],timeout:60000});
 try{
  app=await launch();const page=await app.firstWindow();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await expect(page.locator('#save-status')).toContainText('Ready');
  assert.equal(await page.evaluate(()=>typeof require),'undefined');assert.equal(await page.evaluate(()=>typeof process),'undefined');results.push('packaged launch and renderer isolation');
  await expect(page.frameLocator('#preview').locator('#display-title')).toHaveText('Your next idea starts here.');results.push('public preview loads');
  await page.locator('#title').fill('Windows launch verified');await page.locator('details > summary').click();await page.locator('#notes').fill('OMINOUS_PRIVATE_DESKTOP_SMOKE');
  await expect(page.locator('#save-status')).toContainText('Saved');
  await expect(page.frameLocator('#preview').locator('#display-title')).toHaveText('Windows launch verified');results.push('edit and autosave');
  await page.locator('#motion').check();await expect(page.frameLocator('#preview').locator('body')).toHaveAttribute('data-reduced-motion','true');results.push('reduced motion');
  await page.screenshot({path:path.join(output,'Ominous-Windows.png'),fullPage:true});
  await app.evaluate(({dialog},dir)=>{dialog.showOpenDialog=async()=>({canceled:false,filePaths:[dir]});},data);
  await page.locator('#export').click();await expect(page.locator('#export-result')).toBeVisible();
  const exportDir=await page.locator('#export-path').textContent();for(const name of ['index.html','view.json','captions.srt'])assert.ok(!(await fs.readFile(path.join(exportDir,name),'utf8')).includes('OMINOUS_PRIVATE_DESKTOP_SMOKE'));results.push('native export flow excludes private notes');
  const copy=path.join(data,'test.ominous.json');
  await app.evaluate(({dialog},filePath)=>{dialog.showSaveDialog=async()=>({canceled:false,filePath});},copy);
  await page.locator('#save').click();await expect(page.locator('#notice')).toContainText('copy saved');assert.equal(JSON.parse(await fs.readFile(copy,'utf8')).notes,'OMINOUS_PRIVATE_DESKTOP_SMOKE');results.push('project copy preserves private notes');
  await page.locator('#include-title').uncheck();await expect(page.frameLocator('#preview').locator('#display-title')).toHaveText('Ominous');results.push('excluded fields hidden');
  await page.locator('#include-title').check();await page.locator('#title').fill('Saved while closing');
  await app.close();app=await launch();const reopened=await app.firstWindow();await expect(reopened.locator('#title')).toHaveValue('Saved while closing');results.push('close flush and relaunch recovery');
  await app.evaluate(({dialog})=>{dialog.showOpenDialog=async()=>({canceled:true,filePaths:[]});});await reopened.locator('#open').click();await expect(reopened.locator('#title')).toHaveValue('Saved while closing');results.push('cancelled open preserves project');
  assert.deepEqual(errors,[]);results.push('no renderer page errors');
  await fs.writeFile(path.join(output,'smoke-results.json'),JSON.stringify({platform:process.platform,executablePath,passed:results},null,2));console.log(JSON.stringify(results,null,2));
 }finally{if(app)await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
