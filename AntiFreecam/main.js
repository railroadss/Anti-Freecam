let Discord = require('discord.js'),
    mineflayer = require('mineflayer'),
    chalk = require('chalk'),
    cooldown = new Set(),
    client = new Discord.Client(),
    fs = require('fs'),
    cache = JSON.parse(fs.readFileSync('./cache.json'));
    function printStackTrace(err) {
        console.log(chalk.redBright.bold(`\n[STACKTRACE]: ${err}`));
    }
    function send(text) {
        bot.client.chat('/f c f');
        bot.client.chat(text);
    }
    function getItem(id) {
        if (id == 383) {
            return 'creeper_egg';
        }
        if (id == 344) {
            return 'egg';
        }
        if (id == 332) {
            return 'snowball';
        }
        if (id == 397) {
            return 'creeper_head';
        }
    }
    const embed = new Discord.MessageEmbed()
    .setColor(`#3D42FE`)
    .setFooter(`Anti-Freecam`)
    .setTimestamp()
    client.on('ready', async() => {
        console.log(chalk.hex(`3D42FE`).bold('[DISCORD]') + `\n ${chalk.blueBright.underline(`Discord Bot Loaded | ${client.user.tag}`)} \n  ${chalk.bold(`${client.guilds.cache.array().filter(gd => gd.name).join('\n')}`)}`); 
        if (!client.channels.cache.get(`${cache.anti_freecam.alert_channelID}`)) {
            printStackTrace('alert_channelID Is INVALID');        
        }
    });
    client.on('message', async m => {
    });
    let o =  { 
        version: "1.8",
        host: cache.main.mc_serverip,
        username: cache.main.mc_email,
        password: cache.main.mc_password,
        viewDistance: 'far'
    }
    client.login(cache.main.discord_token).catch(err => {
        printStackTrace(err);
    });
    let bot = {client: mineflayer.createBot(o)};
    bot.client.on('login', async() => {
        try {
            console.log(chalk.hex(`3D42FE`).bold('\n[MINECRAFT]') + `\n ${chalk.blueBright(`${o.host} | ${bot.client.username}`)}`);
            bot.client.chat(cache.main.hub_command);  
        }
        catch (err) {printStackTrace(err)}
    });
    bot.client.on('message', async message => {console.log(message.toAnsi())});
    bot.client.on('entityMoved', async entity => {
        if (entity.type == 'player') {
            if (cooldown.has(entity)) return;
            try {
                if (cache.anti_freecam.holding_items.includes(entity.heldItem.type)) {
                    if (cooldown.has(`${getItem(entity.heldItem.type)}`)) return;
                    cooldown.add(`${getItem(entity.heldItem.type)}`);
                    let alert_messageFormat = "[Anti-Freecam]: [player] Is holding a [item] @ [location]";
                    send(`${alert_messageFormat.toString().replace('[player]', entity.username).replace('[item]', `${getItem(entity.heldItem.type)}`).replace('[location]', entity.position)}`);
                    client.channels.cache.get(client.channels.cache.get(`${cache.anti_freecam.alert_channelID}`).send(embed.setDescription(`**${entity.username}** Is holding a: **${getItem(entity.heldItem.type)}**\nLocation: **${entity.position}**`)));
                }
                setTimeout(() => {
                    try {
                        cooldown.delete(`${getItem(entity.heldItem.type)}`);
                    }
                    catch (err) {}
                }, 5000);
            }
            catch (err) {}
        }
    });
    bot.client.on('blockUpdate', async newb => {
        if (newb.name == 'lava' || newb.name == 'lava_flowing') {
            if (cooldown.has('lava')) return;
            var dispenser = bot.client.findBlock({
                point: newb.position,
                matching: 23,
                maxDistance: 256
            });
            cooldown.add('lava');
            let string = `${dispenser.position.x.toFixed()} ${dispenser.position.y.toFixed()} ${dispenser.position.z.toFixed()}`;
            send(`[Anti-Freecam]: Lava @ ${newb.position} | DISP Loc: ${string}`);
            client.channels.cache.get(client.channels.cache.get(`${cache.anti_freecam.alert_channelID}`).send(embed.setDescription(`Lava Dispensed @ **${newb.position}**\nCorresponding Dispenser: **${string}**`)));
            setTimeout(() => {
                cooldown.delete('lava');
            }, 5000);
        }
    });
    bot.client.on('itemDrop', async entity => {
        entity.metadata.forEach(function(item) {
            if (item.blockId == 325) {
                if (cooldown.has('bucket')) return;
                var dispenser = bot.client.findBlock({
                    point: entity.position,
                    matching: 23,
                    maxDistance: 256
                });
                cooldown.add('bucket');
                let string = `${dispenser.position.x.toFixed()} ${dispenser.position.y.toFixed()} ${dispenser.position.z.toFixed()}`;
                let string2 =  `${entity.position.x.toFixed()} ${entity.position.y.toFixed()} ${entity.position.z.toFixed()}`
                send(`[Anti-Freecam]: Bucket Dispensed @ ${string2} | DISP Loc: ${string}`);
                client.channels.cache.get(client.channels.cache.get(`${cache.anti_freecam.alert_channelID}`).send(embed.setDescription(`Bucket Dispensed @ **${string2}**\nCorresponding Dispenser: **${string}**`)));
                setTimeout(() => {
                    cooldown.delete('bucket');
                }, 5000);
            }
        });
    });
    

