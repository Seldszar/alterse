import { Client, VoiceChannel, Speaking } from "discord.js";
import { get, set, unset } from "lodash";

import { Plugin, PluginContext } from "../plugin";

export class DiscordPlugin extends Plugin {
  readonly client = new Client();

  constructor(context: PluginContext) {
    super(context);

    this.state.set("voiceStates", {});

    this.client.on("ready", async () => {
      const channel = await this.client.channels.fetch(this.profile.discord!.channel);

      if (!channel) {
        return this.logger.error("The provided channel is not found");
      }

      if (channel.type !== "voice") {
        return this.logger.error("The provided channel is not a voice channel");
      }

      const voiceChannel = channel as VoiceChannel;

      voiceChannel.members.forEach((member) => {
        if (this.shouldIgnoreUser(member.id)) {
          return;
        }

        this.state.update("voiceStates", (value) => {
          set(value, member.id, {
            displayName: member.displayName,
            avatar: member.user.avatarURL({ dynamic: false }),
            speaking: Boolean(member.voice.speaking),
          });

          return value;
        });
      });

      this.client.on("voiceStateUpdate", (oldState, newState) => {
        if (oldState.channelID === newState.channelID) {
          return;
        }

        if (this.shouldIgnoreUser(newState.id)) {
          return;
        }

        switch (voiceChannel.id) {
          case newState.channelID: {
            this.logger.debug("%s joined the voice channel", newState.member!.displayName);

            this.state.update("voiceStates", (value) => {
              if (newState.member == null) {
                return value;
              }

              set(value, newState.id, {
                avatar: newState.member.user.avatarURL({ dynamic: false }),
                displayName: newState.member.displayName,
                speaking: false,
              });

              return value;
            });

            break;
          }

          case oldState.channelID: {
            this.logger.debug("%s left the voice channel", oldState.member!.displayName);

            this.state.update("voiceStates", (value) => {
              unset(value, newState.id);

              return value;
            });

            break;
          }
        }
      });

      this.client.on("guildMemberSpeaking", (member, speaking) => {
        const isSpeaking = speaking.has(Speaking.FLAGS.SPEAKING);

        this.state.update("voiceStates", (value) => {
          const voiceState = get(value, member.id);

          if (voiceState) {
            this.logger.debug(
              "%s %s speaking",
              voiceState.displayName,
              isSpeaking ? "started" : "stopped"
            );

            voiceState.speaking = isSpeaking;
          }

          return value;
        });
      });

      await voiceChannel.join();
    });
  }

  async load(): Promise<void> {
    await this.client.login(this.profile.discord!.token);
  }

  async unload(): Promise<void> {
    this.client.destroy();
  }

  private shouldIgnoreUser(userId: string): boolean {
    return (
      userId === this.client.user?.id ||
      (this.profile.discord!.ignoredUsers?.includes(userId) ?? false)
    );
  }
}
