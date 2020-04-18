import globby from "globby";
import inquirer from "inquirer";
import loadJsonFile from "load-json-file";
import path from "path";

export interface Profile {
  name: string;
  paths?: {
    data?: string;
    public?: string;
  };
  discord?: {
    token: string;
    channel: string;
    ignoredUsers?: string[];
  };
}

export function loadProfile(profilePath: string): Profile {
  return loadJsonFile.sync<Profile>(path.resolve(profilePath, "profile.json"));
}

export async function selectProfile(cwd: string): Promise<string> {
  const profilePaths = await globby("profiles/*", {
    onlyDirectories: true,
    absolute: true,
    cwd,
  });

  const choices = profilePaths.map((profilePath) => {
    const profileName = path.basename(profilePath);
    const profile = loadProfile(profilePath);

    return {
      name: profile.name ?? profileName,
      value: profileName,
    };
  });

  if (choices.length === 1) {
    return choices[0].value;
  }

  const answers = await inquirer.prompt([
    {
      choices,
      type: "list",
      name: "profile",
      message: "Select a profile",
    },
  ]);

  return answers.profile;
}
