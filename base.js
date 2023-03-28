const {
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const { Configuration, OpenAIApi } = require("openai");

let setting = require("./key.json");

const customPrompt = fs.readFileSync("custom_prompt.txt", "utf-8");

const chatHistory = readChatHistoryFromFile();

function readChatHistoryFromFile() {
  try {
    const data = fs.readFileSync("chat_history.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function writeChatHistoryToFile(chatHistory) {
  fs.writeFileSync("chat_history.json", JSON.stringify(chatHistory));
}

function updateChatHistory(sender, message) {
  if (!chatHistory[sender]) {
    chatHistory[sender] = [];
  }
  chatHistory[sender].push(message);

  if (chatHistory[sender].length > 20) {
    chatHistory[sender].shift();
  }
}


module.exports = sansekai = async (client, m, chatUpdate, store) => {
  try {

    if (!chatHistory[m.sender]) chatHistory[m.sender] = [];
    const text = m.text;
    const isCmd2 = text.startsWith("!");
    const command = text.trim().split(/ +/).shift().toLowerCase();
    const args = text.trim().split(/ +/).slice(1);


    if (command === "..." || command === "...") {
      
    }
    
    else if (isCmd2) {
      switch (command) {
        case "test":
          
          break;
        default:
          
          break;
      }
    }
    
    else {
      
      if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return;
      
      const configuration = new Configuration({
        apiKey: setting.keyopenai,
      });
      const openai = new OpenAIApi(configuration);

      
      const messages = [
        { role: "system", content: customPrompt },
        ...(chatHistory[m.sender]?.map((msg) => ({ role: msg.role, content: msg.content })) || []),
        { role: "user", content: text },
      ];
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });      
      updateChatHistory(m.sender, { role: "user", content: text });
      updateChatHistory(m.sender, { role: "assistant", content: response.data.choices[0].message.content });
      m.reply(`${response.data.choices[0].message.content}`);
    }
  } catch (err) {
    m.reply(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
