const { Client, GatewayIntentBits, Partials } = require("discord.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot activo!");
});

app.listen(PORT, () => {
  console.log(`Servidor web escuchando en el puerto ${PORT}`);
});
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const TOKEN = process.env.TOKEN;
const PREFIX = "!";

const rolesPermitidos = [
  "Staff",
  "Arbitro",
  "Capitan CS",
  "Capitan LOL",
  "Capitan VALO",
  "Capitan FORTNITE",
];

client.once("ready", () => {
  console.log(`✅ Bot iniciado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.startsWith(PREFIX)
  )
    return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const comando = args.shift().toLowerCase();

  if (comando === "setrol") {
    const tienePermiso = message.member.roles.cache.some((r) =>
      rolesPermitidos.includes(r.name),
    );
    if (!tienePermiso) {
      message.reply("❌ No tenés permiso para usar este comando.");
      return;
    }

    const miembrosMencionados = message.mentions.members;
    const nombreRol = args
      .filter((arg) => !arg.startsWith("<@"))
      .join(" ")
      .trim();

    if (!miembrosMencionados.size || !nombreRol) {
      message.reply("⚠️ Usá el formato: `!setrol @user1 @user2 NombreDelRol`");
      return;
    }

    const rol = message.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === nombreRol.toLowerCase(),
    );

    if (!rol) {
      message.reply(`❌ No encontré el rol **${nombreRol}**.`);
      return;
    }

    let exitosos = 0;
    for (const miembro of miembrosMencionados.values()) {
      try {
        await miembro.roles.add(rol);
        exitosos++;
      } catch (err) {
        console.log(`Error con ${miembro.user.tag}:`, err.message);
      }
    }

    message.reply(
      `✅ Se asignó el rol **${rol.name}** a ${exitosos} usuario(s).`,
    );
  }
});

client.login(TOKEN);
