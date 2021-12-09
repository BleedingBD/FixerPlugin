/**
 * @name FixerPlugin
 * @author Qb
 * @description Automatically fixes known hardcoded by deleting plugin files and downloading current versions
 * @version 1.0.0
 **/

const filename = "00FixerPlugin.plugin.js";

const plugins = BdApi.Plugins.folder;
const {resolve} = require("path");
const fs = require("fs");

const fixes = [
    {
        path: resolve(plugins, "0BDFDB.plugin.js"),
        replacement: "https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Library/0BDFDB.plugin.js"
    },
    {
        path: resolve(plugins, "0PluginLibrary.plugin.js"), 
        replacement: "https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
    }
];

module.exports = class {
    load(){
        const promises = fixes.map(
            (f)=>{
                if (!fs.existsSync(f.path)) return;
                if (!f.content || f.content.test(fs.readFileSync(f.path))){
                    console.info("FixerPlugin",`Removing ${f.path}`);
                    fs.unlinkSync(f.path);
                    if (f.replacement) {
                        console.info("FixerPlugin",`Downloading replacement from ${f.replacement}`);
                        return fetch(f.replacement).then(res=>res.text()).then(
                            (text) => {
                                console.info("FixerPlugin",`Saving replacement file for ${f.path}`);
                                fs.writeFileSync(f.path, text);
                            }
                        )
                    }
                }
            }
        )
        Promise.allSettled(promises).then(()=>{
            fs.unlinkSync(resolve(plugins, filename));
            window.location.reload();
        })
    }
    start(){}
    stop(){}
}
