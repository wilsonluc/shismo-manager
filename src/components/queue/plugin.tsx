import { Skill, fishing, hunter, mining, slayer } from "./skill";

export interface Plugin {
    skill: Skill;
    pluginName: string;
};

export const plugins: Plugin[]  = [
    {skill: fishing, pluginName: 'Tempoross'},
    {skill: hunter, pluginName: 'Hunters\' Rumours'},
    {skill: mining, pluginName: 'Motherlode Mine'},
    {skill: slayer, pluginName: 'Slayer'},
]
// TODO: Add more

export const getAssociatedPlugins = (skill: Skill): Plugin[] => {
    return plugins.filter(plugin => plugin.skill === skill);
}