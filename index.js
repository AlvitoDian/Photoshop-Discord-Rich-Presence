import DRPC from "discord-rpc";
const { Client: RPCClient, register } = DRPC;
import { activeWindow } from "active-win";

const clientId = "1240188139285512266";
const RPC = new RPCClient({ transport: "ipc" });

register(clientId);

let currentProject;
let currentFile = null;
let startTimestamp = new Date();
/* let timeoutID; */

async function checkActivity() {
  const window = await activeWindow();

  try {
    let processName = window.owner.name;
    let processFile = window.title;

    if (processName == "Adobe Photoshop 2020") {
      /*     clearTimeout(timeoutID); */
      if (processFile.includes(".psd") || processFile.includes("% (RGB/")) {
        let split = processFile.split("@");

        if (split[0] !== currentProject) {
          currentProject = split[0];
          currentFile = split[1].match(/\(([^)]+)\)/)[1].split(",")[0];

          updateRP(currentProject, `Editing ${currentFile}`);
        } else if (currentFile !== split[1]) {
          currentFile = split[1].match(/\(([^)]+)\)/)[1].split(",")[0];
          updateRP(currentProject, `Editing ${currentFile}`);
        }
      }
    } /*  else {
      timeoutID = setTimeout(() => {
        currentProject = null;
        currentFile = null;
        updateRP(null, "Rehat");
      }, 10 * 60 * 1000);
    } */
  } catch (error) {
    console.log(error);
  }
}

function updateRP(project, status) {
  RPC.setActivity({
    details: project || "Rehat Bentar",
    state: status,
    startTimestamp: startTimestamp,
    largeImageKey:
      "https://res.cloudinary.com/dgfcvu9ns/image/upload/v1715755757/discordRPC/photoshop_c0bbaw.png",
    smallImageKey:
      "https://res.cloudinary.com/dgfcvu9ns/image/upload/v1715767484/discordRPC/editps_uszpi2.png",
    largeImageText: "Adobe Photoshop",
    smallImageText: "Editing",
    instance: false,
  });

  console.log(`Updated Status: ${status}`);
}

RPC.on("ready", () => {
  console.log("Rich Presence is active!");

  setInterval(() => {
    checkActivity();
  }, 5000);
});

RPC.login({ clientId }).catch(console.error);
